"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
  getYears,
  MAJORS,
  newPersonFormSchema,
  newPersonFormSchemaToPerson,
} from "~/schemas";

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
          className="space-y-8 pb-16"
          onSubmit={form.handleSubmit(onSubmit)}
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
                    placeholder="name@brandeis.edu"
                    type="email"
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
                    className="flex flex-col space-y-1"
                    defaultValue={field.value}
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
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Which year do you graduate?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getYears().map((year) => (
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
                    defaultValue={field.value}
                    onValueChange={field.onChange}
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
                    control={form.control}
                    key={major}
                    name="majors"
                    render={({ field }) => {
                      return (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0"
                          key={major}
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
                return <div />;
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
                    control={form.control}
                    key={ethnicity}
                    name="ethnicities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0"
                          key={ethnicity}
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
                return <div />;
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
                    defaultValue={field.value}
                    onValueChange={(value: string) => {
                      setGenderShowOther(value === "Other");
                      field.onChange(value);
                    }}
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
              className="w-full"
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : "Submit"}
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                router.back();
              }}
              type="button"
              variant={"secondary"}
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
        aria-expanded={isExpanded}
        className="flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        type="button"
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
        <div className="fade-in slide-in-from-top-1 mt-2 animate-in border-muted border-l-2 pl-5 text-muted-foreground text-sm duration-200">
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
    <div className="fixed right-4 bottom-4 z-50">
      <div className="flex flex-col gap-2">
        <button
          aria-label="Scroll up"
          className="flex h-32 w-32 items-center justify-center rounded-full border backdrop-blur-sm"
          onClick={scrollUp}
          type="button"
        >
          <ArrowUp size={64} />
        </button>
        <button
          aria-label="Scroll down"
          className="flex h-32 w-32 items-center justify-center rounded-full border backdrop-blur-sm"
          onClick={scrollDown}
          type="button"
        >
          <ArrowDown size={64} />
        </button>
      </div>
    </div>
  );
}
