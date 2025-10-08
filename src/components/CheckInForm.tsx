"use client";

import type { Lab, NewCheckIn, Person } from "~/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CONFIG, newCheckInFormSchema } from "~/schemas";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="reasons"
            render={() => (
              <FormItem>
                <FormLabel>Please select a reason for your visit</FormLabel>
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
                                field.value.includes(reason) &&
                                  "border-blue-500 bg-blue-100",
                              )}
                            >
                              <CardHeader className="flex flex-row items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.includes(reason)}
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
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loading /> : "Submit"}
            </Button>
            <Button
              onClick={() => {
                router.back();
              }}
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
