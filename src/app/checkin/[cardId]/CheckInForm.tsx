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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useRouter } from "next/navigation";

const REASONS = [
  "3D Printing",
  "Sewing",
  "Lazer Cutting",
  "Hand Tools",
] as const;
const formSchema = z.object({
  cardId: z.string().length(15, "Invalid card id"),
  email: z.string().email(),
  name: z.string(),
  reason: z.enum(REASONS),
});

export function CheckInForm({ person }: { person: Person }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: person.cardId,
      email: person.email,
      name: person.name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await postCheckIn(values);
    router.push("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {REASONS.map((reason) => (
                    <ReasonItem value={reason} key={reason} />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function ReasonItem({ value }: { value: string }) {
  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem value={value} />
      </FormControl>
      <FormLabel className="font-normal">{value}</FormLabel>
    </FormItem>
  );
}
