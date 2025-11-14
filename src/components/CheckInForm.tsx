"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MUTATIONS } from "~/lib/server-actions";
import { cn } from "~/lib/utils";
import type { Lab, NewCheckIn, Person } from "~/schemas";
import { CONFIG, newCheckInFormSchema } from "~/schemas";

import { Loading } from "./Loading";
import { TimeOut } from "./TimeOut";

export function CheckInForm({
  person,
  lab,
  redirectUrl,
}: {
  person: Person;
  lab: Lab;
  redirectUrl: string;
}) {
  const config = CONFIG[lab];

  const router = useRouter();
  const reasons = config.reasons;
  const sheetName = config.sheetName;
  const form = useForm<NewCheckIn>({
    resolver: zodResolver(newCheckInFormSchema),
    defaultValues: {
      person: person,
      reasons: [],
      reasonOther: "",
      startTime: new Date(),
    },
  });

  async function onSubmit(values: NewCheckIn) {
    console.log("on submit", { redirectUrl, sheetName, values });
    await MUTATIONS.postCheckIn(values, sheetName);
    router.push(redirectUrl);
  }

  return (
    <>
      <TimeOut href={redirectUrl} />
      <h2 className="text-lg">Welcome, {person.name}</h2>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="reasons"
            render={() => (
              <FormItem>
                <FormLabel>Please select a reason for your visit</FormLabel>
                <div className="grid auto-rows-fr grid-cols-4 items-stretch gap-4">
                  {reasons.map((reason) => (
                    <FormField
                      control={form.control}
                      key={reason}
                      name="reasons"
                      render={({ field }) => (
                        <FormItem className="h-full space-y-0">
                          <FormLabel className="h-full font-normal">
                            <Card
                              className={cn(
                                "h-full",
                                field.value.includes(reason) &&
                                  "border-blue-500 bg-blue-100",
                              )}
                            >
                              <CardHeader className="flex h-full flex-row items-center gap-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.includes(reason)}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                    onCheckedChange={(checked: boolean) => {
                                      if (checked) {
                                        field.onChange([
                                          ...field.value,
                                          reason,
                                        ]);
                                      } else {
                                        field.onChange(
                                          field.value.filter(
                                            (value) => value !== reason,
                                          ),
                                        );
                                      }
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
                <Input autoFocus {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : "Submit"}
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                router.back();
              }}
              type="button"
              variant={"secondary"}
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
