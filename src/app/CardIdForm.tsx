"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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
    .startsWith("603305", { message: "Brandeis cards must start with 603305" })
    .min(15, {
      message: "Card ID must be 15 numbers",
    })
    .max(15, {
      message: "Card ID must be 15 numbers",
    }),
});
type FormSchema = z.infer<typeof formSchema>;

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
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (values: FormSchema) => {
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
    const interval = setInterval(() => form.setFocus("cardId"), 1 * 1000);
    return () => clearInterval(interval);
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cardId"
          render={({ field }) => {
            const { onChange, ...rest } = field;
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
                    placeholder="603305000000000"
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      if (e.currentTarget.value.length > 15) return;
                      return onChange(e);
                    }}
                    {...rest}
                  />
                </FormControl>
                <FormDescription>
                  This is your Brandeis ID card number
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
          {form.formState.isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
