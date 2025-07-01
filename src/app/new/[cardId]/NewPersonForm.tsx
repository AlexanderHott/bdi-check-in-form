"use client";

import type { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "~/components/Loading";
import { TimeOut } from "~/components/TimeOut";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { postNewPerson } from "~/lib/server-actions/actions";
import { cn } from "~/lib/utils";
import {
  ETHNICITIES,
  GENDERS,
  GRADUATE_STATUS,
  MAJORS,
  newPersonFormSchema,
  newPersonFormSchemaToPerson,
  YEARS,
} from "~/schemas";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

type NewPersonFormSchema = z.infer<typeof newPersonFormSchema>;

export function NewPersonForm({ cardId }: { cardId: string }) {
  const router = useRouter();
  const form = useForm<NewPersonFormSchema>({
    resolver: zodResolver(newPersonFormSchema),
    defaultValues: {
      cardId: cardId,
      email: "",
      name: "",
      graduateStatus: "Undergraduate Student",
      graduateStatusOther: "",
      graduatingYear: "",
      graduateResearchStatus: "",
      majors: [],
      majorOther: "",
      ethnicities: [],
      ethnicityOther: "",
      gender: "Male",
      genderOther: "",
    },
  });

  const [graduateStatusShowOther, setGraduateStatusShowOther] = useState(false);
  const [graduateStatusShowYear, setGraduateStatusShowYear] = useState(
    form.formState.defaultValues?.graduateStatus === "Undergraduate Student",
  );
  const [graduateStatusShowResearch, setGraduateStatusShowResearch] = useState(
    form.formState.defaultValues?.graduateStatus === "Graduate Student",
  );
  const [majorShowOther, setMajorShowOther] = useState(false);
  const [ethnicityShowOther, setEthnicityShowOther] = useState(false);
  const [genderShowOther, setGenderShowOther] = useState(false);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  async function onSubmit(value: NewPersonFormSchema) {
    const person = newPersonFormSchemaToPerson(value);
    await postNewPerson(person);

    const redirectUrlDecoded = decodeURI(redirectUrl ?? "/");
    router.push(redirectUrlDecoded);
  }

  return (
    <>
      <TimeOut href="/" />
      <ScrollButtons />
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
                    autoFocus
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
                    onValueChange={(
                      value: (typeof GRADUATE_STATUS)[number],
                    ) => {
                      if (value === "Other") {
                        setGraduateStatusShowOther(true);
                      } else {
                        setGraduateStatusShowOther(false);
                      }
                      // clear graduating year if they select a field with student and then another one
                      if (value === "Undergraduate Student") {
                        setGraduateStatusShowYear(true);
                      } else {
                        setGraduateStatusShowYear(false);
                        form.setValue("graduatingYear", "");
                      }

                      if (value === "Graduate Student") {
                        setGraduateStatusShowResearch(true);
                      } else {
                        setGraduateStatusShowResearch(false);
                        form.setValue("graduateResearchStatus", "");
                      }

                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {GRADUATE_STATUS.map((gs) => (
                      <RadioItem key={gs} value={gs} />
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
            Graduating Year Other field 
          */}
          {graduateStatusShowOther && (
            <FormField
              control={form.control}
              name="graduateStatusOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other</FormLabel>
                  <FormControl>
                    <Input placeholder="What best describes you?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                    defaultValue={field.value.toString()}
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
            PhD / Masters Progress 
          */}
          {graduateStatusShowResearch && (
            <FormField
              control={form.control}
              name="graduateResearchStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduate Research Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="What are you currently doing?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Course work">Course work</SelectItem>
                      <SelectItem value="Dissertation work">
                        Dissertation work
                      </SelectItem>
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
                              checked={field.value.includes(major)}
                              onCheckedChange={(checked: boolean) => {
                                if (major === "Other" && checked) {
                                  setMajorShowOther(true);
                                } else if (major === "Other" && !checked) {
                                  setMajorShowOther(false);
                                }
                                if (checked) {
                                  field.onChange([...field.value, major]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (value: string) => value !== major,
                                    ),
                                  );
                                }
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
            render={({ field }) => {
              if (!majorShowOther) {
                return <></>;
              }
              return (
                <FormItem>
                  <FormLabel>Other major</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Which degree or department best describes you?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
                              checked={field.value.includes(ethnicity)}
                              onCheckedChange={(checked: boolean) => {
                                if (ethnicity === "Other" && checked) {
                                  setEthnicityShowOther(true);
                                } else if (ethnicity === "Other" && !checked) {
                                  setEthnicityShowOther(false);
                                }
                                if (checked) {
                                  field.onChange([...field.value, ethnicity]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (value: string) => value !== ethnicity,
                                    ),
                                  );
                                }
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
            Ethnicity Other field 
          */}
          <FormField
            control={form.control}
            name="ethnicityOther"
            render={({ field }) => {
              if (!ethnicityShowOther) {
                return <></>;
              }
              return (
                <FormItem>
                  <FormLabel>Other ethnicity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Which race/ethnicity best describes you?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
                    className="flex flex-col space-y-1"
                    onValueChange={(value: string) => {
                      setGenderShowOther(value === "Other");
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    {GENDERS.map((gs) => (
                      <RadioItem key={gs} value={gs} />
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 
            Gender Other textbox 
          */}
          {genderShowOther && (
            <FormField
              control={form.control}
              name="genderOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Gender</FormLabel>
                  <FormControl>
                    <FormControl>
                      <Input
                        placeholder="Which gender best describes you?"
                        {...field}
                      />
                    </FormControl>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* 
            Submit and back button 
          */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loading /> : "Submit"}
            </Button>
            <Button
              onClick={() => {
                router.back();
              }}
              variant={"secondary"}
              type="button"
              className="w-full"
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </>
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
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isExpanded}
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isExpanded ? "rotate-180" : "",
          )}
        />
        <span className="underline underline-offset-4">
          Why do we ask for this?
        </span>
      </button>

      {isExpanded && (
        <div className="mt-2 text-sm text-muted-foreground pl-5 border-l-2 border-muted animate-in fade-in slide-in-from-top-1 duration-200">
          At Brandeis Design and Innovation, we are committed to building a
          diverse and inclusive community. Collecting demographic information
          helps us to measure our efforts toward these goals!
        </div>
      )}
    </div>
  );
}

const scrollUp = () => {
  window.scrollBy({ top: (-window.innerHeight * 3) / 4, behavior: "smooth" });
};

const scrollDown = () => {
  window.scrollBy({ top: (window.innerHeight * 3) / 4, behavior: "smooth" });
};

function ScrollButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2">
        <button
          onClick={scrollUp}
          className="flex h-32 w-32 items-center justify-center rounded-full border  backdrop-blur-sm"
          aria-label="Scroll up"
        >
          <ArrowUp size={64} />
        </button>
        <button
          onClick={scrollDown}
          className="flex h-32 w-32 items-center justify-center rounded-full border  backdrop-blur-sm"
          aria-label="Scroll down"
        >
          <ArrowDown size={64} />
        </button>
      </div>
    </div>
  );
}
