"use client";
import { postCheckIn, type Person } from "~/lib/sheets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { TimeOut } from "~/components/TimeOut";
import { Input } from "~/components/ui/input";

const REASONS = [
  "Geospatial or survey work",
  "3D scanning and modeling",
  "High-performance computing",
  "Consulting",
] as const;

const REASON_TO_IMAGE = {
  "Geospatial or survey work": "/mapping.jpg",
  "3D scanning and modeling": "/3d-scanning.webp",
  "High-performance computing": "/high-performance-computing.webp",
  Consulting: "/consulting.jpg",
} satisfies Record<(typeof REASONS)[number], string>;

const formSchema = z.object({
  cardId: z.string().length(15, "Invalid card id"),
  email: z.string().email(),
  name: z.string(),
  gender: z.string(),
  ethnicities: z.array(z.string()),
  graduateStatus: z.string(),
  graduatingYear: z.string().optional(),
  majors: z.array(z.string()),
  reasons: z.array(z.enum(REASONS).or(z.string())),
  reason_other: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export function DSLCheckInForm({ person }: { person: Person }) {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: person.cardId,
      email: person.email,
      name: person.name,
      gender: person.gender,
      ethnicities: person.ethnicities,
      graduateStatus: person.graduateStatus,
      graduatingYear: person.graduatingYear,
      majors: person.majors,
      reasons: [],
      reason_other: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    console.log("on submit", values);
    let newValues = values;
    if (values.reason_other) {
      newValues = {
        ...values,
        reasons: [...values.reasons, `other:${values.reason_other}`],
      };
    }

    await postCheckIn(newValues, "dsl-checkins");
    router.push("/dsl");
  }

  return (
    <>
      <TimeOut timeout={60} href="/dsl" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="reasons"
            render={() => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <div className="flex flex-row flex-wrap gap-4">
                  {REASONS.map((reason) => (
                    <FormField
                      key={reason}
                      control={form.control}
                      name="reasons"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal">
                            <Card>
                              <CardHeader className="flex flex-row items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(reason)}
                                    onCheckedChange={(checked) => {
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
                              <CardContent>
                                <Image
                                  src={REASON_TO_IMAGE[reason]}
                                  alt=""
                                  height={128}
                                  width={Math.round((128 * 16) / 9)}
                                  className="pointer-events-none aspect-video rounded-sm object-cover"
                                />
                              </CardContent>
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
            name="reason_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
