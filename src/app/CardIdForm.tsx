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
  cardId: z
    .string()
    .min(15, {
      message: "Card ID must be 15 numbers",
    })
    .max(15, {
      message: "Card ID must be 15 numbers",
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

export function CardIdForm({
  redirect, // must end with a "/"
}: {
  redirect: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      console.log(values);
      router.push(redirect + values.cardId.toString());
    },
    [router, redirect],
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

  useEffect(() => {
    const interval = setInterval(() => form.setFocus("cardId"), 30 * 1000);
    return () => clearInterval(interval);
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cardId"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Brandeis ID</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    type="number"
                    disabled={
                      form.formState.isSubmitted &&
                      (form.formState.isValid || form.formState.isValidating)
                    }
                    placeholder="123456789101112"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your Brandies ID card number
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button
          type="submit"
          disabled={
            form.formState.isSubmitted &&
            (form.formState.isValid || form.formState.isValidating)
          }
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
