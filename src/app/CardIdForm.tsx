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
    .trim()
    .refine((value) => value.length === 15, {
      message: "Card ID must be exactly 15 characters long",
    })
    .refine((value) => /^\d+$/.test(value), {
      message: "Card ID must contain only numeric digits",
    })
    .refine((value) => value.startsWith("603305"), {
      message: "Card ID must start with 603305 for Brandeis cards",
    })
    .transform((value) => value.replace(/\s/g, "")),
});
type FormSchema = z.infer<typeof formSchema>;

export function CardIdForm({
  redirect, // must end with a "/"
}: {
  redirect: string;
}) {
  if (!redirect.endsWith("/")) {
    throw new Error("redirect must end with a /");
  }

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
          form
            .trigger()
            .then((isValid) => {
              if (isValid) {
                void form.handleSubmit(onSubmit)();
              }
            })
            .catch((e) => console.error("Error submitting form " + e));
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
          render={({ field }) => {
            const { onChange, onBlur, ...rest } = field;
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
                      if (e.currentTarget.value.length <= 15)
                        return onChange(e);
                    }}
                    onBlur={() => {
                      onBlur();
                      form.setFocus("cardId");
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

        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-full"
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
          <Button
            type="button"
            className="w-full"
            variant={"secondary"}
            onClick={() => window.location.reload()}
          >
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
