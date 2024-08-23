"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  cardId: z.string().min(2, {
    message: "Swipe your ID card",
  }),
});

// function usePerson(cardId: string) {
//   return useQuery({
//     queryKey: ["person", cardId],
//     queryFn: async () => {
//       const res = await fetch(`/api/person/${cardId}`);
//       if (!res.ok) throw new Error(res.statusText);
//       return (await res.json()) as Person;
//     },
//   });
// }
//
export function CardIdForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      console.log(values);
      router.push(`/checkin/${values.cardId}`);
    },
    [router],
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "cardId") {
        const { cardId } = value;
        if (cardId?.length === 15) {
          void form.handleSubmit(onSubmit)();
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brandeis ID</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  type="number"
                  disabled={form.formState.isSubmitted}
                  placeholder="123456789101213"
                  {...field}
                  onChange={(e) => {
                    if (e.target.value) {
                      field.onChange(e);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                This is your Brandies ID card number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitted}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
