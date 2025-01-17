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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { RadioGroupItem, RadioGroup } from "~/components/ui/radio-group";
import { postNewPerson } from "~/lib/sheets";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";

const GRADUATE_STATUS = [
  "Undergraduate Student",
  "Graduate Student",
  "Staff",
  "Faculty",
  "Alum",
  "Other",
];

const MAJORS = [
  "STEM",
  "Social sciences",
  "Humanities",
  "Business School",
  "Art",
  "Other",
];

const ETHNICITIES = [
  "White",
  "Black or African American",
  "American Indian or Alaska Native",
  "Asian",
  "Native Hawaiian or Other Pacific Islander",
  "Prefer not to answer",
  "Other",
];

const GENDERS = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to answer",
  "Other",
];

const formSchema = z
  .object({
    cardId: z.string().min(2).max(50),
    email: z.string().email(),
    name: z.string(),
    graduateStatus: z.string(),
    graduatingYear: z.string().optional(),
    majors: z.array(z.string()),
    majorOther: z.string().optional(),
    ethnicities: z.array(z.string()),
    ethnicityOther: z.string().optional(),
    gender: z.string(),
  })
  .refine(
    (data) =>
      !(
        data.graduateStatus.includes("Student") &&
        data.graduatingYear === undefined
      ),
    {
      message: "Graduation Year is required when you are a student",
      path: ["graduateStatus"],
    },
  );
type FormSchema = z.infer<typeof formSchema>;

const YEARS = Array(5)
  .fill(0)
  .map((_, i) => (new Date().getFullYear() + i).toString());

export function NewPersonForm({ cardId }: { cardId: string }) {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: cardId,
      email: "",
      name: "",
      graduateStatus: "",
      graduatingYear: "",
      majors: [],
      majorOther: "",
      ethnicities: [],
      ethnicityOther: "",
      gender: "",
    },
  });

  const [graduateStatusShowOther, setGraduateStatusShowOther] = useState(false);
  const [graduateStatusShowYear, setGraduateStatusShowYear] = useState(false);
  const [majorShowOther, setMajorShowOther] = useState(false);
  const [ethnicityShowOther, setEthnicityShowOther] = useState(false);
  const [genderShowOther, setGenderShowOther] = useState(false);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  async function onSubmit(values: FormSchema) {
    await postNewPerson(values);
    const decodedRedirectUrl = decodeURI(redirectUrl ?? "/");
    router.push(decodedRedirectUrl);
  }
  return (
    <div className="flex flex-col gap-4">
      <WhyDoWeAsk />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-16"
        >
          {/* 
            Email field 
          */}
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
          {/* 
            Name field 
          */}
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
          {/* 
            Graduate Status field 
          */}
          <FormField
            control={form.control}
            name="graduateStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What best describes you?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value: string) => {
                      if (value === "Other") {
                        field.onChange("");
                        setGraduateStatusShowOther(true);
                      } else {
                        field.onChange(value);
                        setGraduateStatusShowOther(false);
                      }
                      // clear graduating year if they select a field with student and then another one
                      if (value.includes("Student")) {
                        setGraduateStatusShowYear(true);
                      } else {
                        setGraduateStatusShowYear(false);
                        form.setValue("graduatingYear", undefined);
                      }
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {GRADUATE_STATUS.map((gs) => (
                      <RadioItem key={gs} value={gs} />
                    ))}
                  </RadioGroup>
                </FormControl>
                {graduateStatusShowOther && (
                  <FormControl>
                    <Input
                      placeholder="Other"
                      {...field}
                      value={
                        GRADUATE_STATUS.includes(field.value) &&
                        field.value !== "Other"
                          ? ""
                          : field.value
                      }
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        field.onChange(e.target.value)
                      }
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
            Graduating Year field 
          */}
          {graduateStatusShowYear && (
            <FormField
              control={form.control}
              name="graduatingYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduating Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Which year do you graduate?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* 
            Majors field 
          */}
          <FormField
            control={form.control}
            name="majors"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>
                    Which degree or department best describes you? Select all
                    that apply.
                  </FormLabel>
                </div>
                {MAJORS.map((major) => (
                  <FormField
                    key={major}
                    control={form.control}
                    name="majors"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={major}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(major)}
                              onCheckedChange={(checked: boolean) => {
                                if (major === "Other" && checked) {
                                  setMajorShowOther(true);
                                } else if (major === "Other" && !checked) {
                                  setMajorShowOther(false);
                                }
                                return checked
                                  ? field.onChange([
                                      ...(field.value as string[]),
                                      major,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== major,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{major}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 
            Other Major field 
          */}
          <FormField
            control={form.control}
            name="majorOther"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {majorShowOther && (
                    <Input placeholder="Other major" {...field} />
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          {/* 
            Ethnicities field 
          */}
          <FormField
            control={form.control}
            name="ethnicities"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>
                    Which race/ethnicity best describes you? (choose all that
                    apply)
                  </FormLabel>
                </div>
                {ETHNICITIES.map((ethnicity) => (
                  <FormField
                    key={ethnicity}
                    control={form.control}
                    name="ethnicities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={ethnicity}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(ethnicity)}
                              onCheckedChange={(checked: boolean) => {
                                if (ethnicity === "Other" && checked) {
                                  setEthnicityShowOther(true);
                                } else if (ethnicity === "Other" && !checked) {
                                  setEthnicityShowOther(false);
                                }
                                return checked
                                  ? field.onChange([
                                      ...(field.value as string[]),
                                      ethnicity,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== ethnicity,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {ethnicity}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 
            Other Ethnicity field 
          */}
          <FormField
            control={form.control}
            name="ethnicityOther"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {ethnicityShowOther && (
                    <Input placeholder="Other major" {...field} />
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          {/* 
            Gender field 
          */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which gender best describes you?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value: any) => {
                      if (value === "Other") {
                        field.onChange("");
                        setGenderShowOther(true);
                      } else {
                        field.onChange(value);
                        setGenderShowOther(false);
                      }
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {GENDERS.map((gs) => (
                      <RadioItem key={gs} value={gs} />
                    ))}
                  </RadioGroup>
                </FormControl>
                {genderShowOther && (
                  <FormControl>
                    <Input
                      placeholder="Other"
                      {...field}
                      value={
                        GENDERS.includes(field.value) && field.value !== "Other"
                          ? ""
                          : field.value
                      }
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        field.onChange(e.target.value)
                      }
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitted}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
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

function WhyDoWeAsk() {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center gap-1 text-muted-foreground">
        Why do we ask for this? <ChevronsUpDown size={16} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="">
          At Brandeis Design and Innovation, we are committed to building a
          diverse and inclusive community. Collecting demographic information
          helps us to measure our efforts toward these goals!
        </p>
        <p>
          All demographic questions are optional - but it helps us if you are
          willing to answer them! You only have to fill out this portion once!
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
