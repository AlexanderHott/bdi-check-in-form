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

const REASON_TO_IMAGE = {
  "3D Printing": "/3d-printing.webp",
  Sewing: "/sewing.webp",
  "Laser Cutting": "/laser-cutting.webp",
  "Hand Tools": "/hand-tools.webp",
} as const;
const REASONS = [
  "3D Printing",
  "Sewing",
  "Laser Cutting",
  "Hand Tools",
] as const;

const formSchema = z.object({
  cardId: z.string().length(15, "Invalid card id"),
  email: z.string().email(),
  name: z.string(),
  gender: z.string(),
  ethnicity: z.string(),
  reasons: z.array(z.enum(REASONS)),
  reason_other: z.string(),
});

export function MLCheckInForm({ person }: { person: Person }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: person.cardId,
      email: person.email,
      name: person.name,
      gender: person.gender,
      ethnicity: person.ethnicity,
      reasons: [],
      reason_other: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("on submit", values);
    await postCheckIn(
      {
        ...values,
        reasons: [...values.reasons, `other:${values.reason_other}`],
      },
      "ml-checkins",
    );
    router.push("/ml");
  }

  return (
    <>
      <TimeOut timeout={60} href="/ml" />
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
                                  width={250}
                                  height={250}
                                  className="pointer-events-none rounded-sm"
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
