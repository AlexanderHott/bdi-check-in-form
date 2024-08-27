"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Input } from "~/components/ui/input";
import { RadioGroupItem, RadioGroup } from "~/components/ui/radio-group";
import { postNewPerson } from "~/lib/sheets";

const ETHNICITIES = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Other",
  "Prefer not to answer",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to answer"];

const formSchema = z.object({
  cardId: z.string().min(2).max(50),
  email: z.string().email(),
  name: z.string(),
  gender: z.string(),
  ethnicity: z.string(),
});

export function NewPersonForm({ cardId }: { cardId: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: cardId,
      email: "",
      name: "",
      gender: "",
      ethnicity: "",
    },
  });
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await postNewPerson(values);
    const decodedRedirectUrl = decodeURI(redirectUrl ?? "/");
    router.push(decodedRedirectUrl);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@brandeis.edu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {GENDERS.map((gender) => (
                    <RadioItem key={gender} value={gender} />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ethnicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ethnicity</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {ETHNICITIES.map((ethnicity) => (
                    <RadioItem key={ethnicity} value={ethnicity} />
                  ))}
                </RadioGroup>
              </FormControl>
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

function RadioItem({ value }: { value: string }) {
  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem value={value} />
      </FormControl>
      <FormLabel className="font-normal">{value}</FormLabel>
    </FormItem>
  );
}
