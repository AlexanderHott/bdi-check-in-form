"use client";
import { postCheckIn } from "~/lib/sheets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { type Person, type CheckIn, checkInSchmas } from "~/schemas";
import { type z } from "zod";
import { cn } from "~/lib/utils";
import { Loading } from "./Loading";
import { TimeOut } from "./TimeOut";

export function CheckInForm({
  person,
  schemaName,
  reasons,
  redirectUrl,
  sheetName,
}: {
  person: Person;
  schemaName: keyof typeof checkInSchmas;
  reasons: Readonly<CheckIn["reasons"]>;
  redirectUrl: string;
  sheetName: string;
}) {
  const router = useRouter();
  const schema = checkInSchmas[schemaName];
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      person: person,
      reasons: [],
      reasonOther: "",
    },
  });

  async function onSubmit(values: CheckIn) {
    console.log("on submit", { redirectUrl, sheetName, values });
    await postCheckIn(values, sheetName);
    router.push(redirectUrl);
  }

  return (
    <>
      <TimeOut href={redirectUrl} />
      <h2 className="text-lg">Welcome, {person.name}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="reasons"
            render={() => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <div className="grid auto-rows-fr grid-cols-4 grid-rows-2 gap-4">
                  {reasons.map((reason) => (
                    <FormField
                      key={reason}
                      control={form.control}
                      name="reasons"
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormLabel className="font-normal">
                            <Card
                              className={cn(
                                // @ts-expect-error not specific enough generics
                                field.value?.includes(reason) &&
                                  "border-blue-500 bg-blue-100",
                              )}
                            >
                              <CardHeader className="flex flex-row items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    // @ts-expect-error not specific enough generics
                                    checked={field.value?.includes(reason)}
                                    onCheckedChange={(checked: boolean) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            reason,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== reason,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                {reason}
                              </CardHeader>
                            </Card>
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reasonOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loading /> : "Submit"}
            </Button>
            <Button
              onClick={() => router.back()}
              variant={"secondary"}
              type="button"
              className="w-full"
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
