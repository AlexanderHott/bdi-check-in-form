"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
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
import { QUERIES } from "~/lib/server-actions";
import type { Lab } from "~/schemas";
import { CONFIG } from "~/schemas";

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

type EndsWithSlash = `${string}/`;

export function CardIdForm({
  redirect, // must end with a "/"
  lab,
}: {
  redirect: EndsWithSlash;
  lab: Lab;
}) {
  if (!redirect.endsWith("/")) {
    throw new Error("redirect prop must end with a /");
  }
  const config = CONFIG[lab];
  const sheetName = config.sheetName;

  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    async (values: FormSchema) => {
      const checkin = await QUERIES.getRecentCheckin(sheetName, values.cardId);

      const checkinExists = checkin !== null;
      const checkinCompleted = Boolean(checkin?.endTime);
      if (!checkinExists || checkinCompleted) {
        router.push(`${redirect}/check-in/${values.cardId}`);
      } else {
        router.push(`${redirect}/check-out/${values.cardId}`);
      }
    },
    [router, redirect, sheetName],
  );

  return (
    <Form {...form}>
      <pre>
        state:{" "}
        {JSON.stringify(
          {
            isSubmitting: form.formState.isSubmitting,
            isValid: form.formState.isValid,
            isLoading: form.formState.isLoading,
            isSubmitted: form.formState.isSubmitted,
            isSubmitSuccessful: form.formState.isSubmitSuccessful,
          },
          null,
          2,
        )}
      </pre>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
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
                    disabled={form.formState.isSubmitting}
                    onBlur={() => {
                      onBlur();
                      form.setFocus("cardId");
                    }}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      const CARD_ID_LENGTH = 15;
                      onChange(e);
                      if (e.currentTarget.value.length < CARD_ID_LENGTH) {
                        return;
                      }

                      form
                        .trigger()
                        .then((isValid) => {
                          if (isValid) {
                            void form.handleSubmit(onSubmit)();
                          }
                        })
                        .catch((e: unknown) => {
                          console.error(`Error submitting form ${String(e)}`);
                        });
                    }}
                    placeholder="603305000000000"
                    type="number"
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
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting || form.formState.isSubmitted ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              window.location.reload();
            }}
            type="button"
            variant={"secondary"}
          >
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
