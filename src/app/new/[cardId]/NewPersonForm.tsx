"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useRef, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import {
  ETHNICITIES,
  GENDERS,
  GRADUATE_STATUS,
  MAJORS,
  newPersonSchema,
  YEARS,
  type NewPerson,
} from "~/schemas";
import { Loading } from "~/components/Loading";
import { TimeOut } from "~/components/TimeOut";

export function NewPersonForm({ cardId }: { cardId: string }) {
  const router = useRouter();
  const form = useForm<NewPerson>({
    resolver: zodResolver(newPersonSchema),
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

  async function onSubmit(value: NewPerson) {
    console.log("new person", value);
    await postNewPerson(value);
    const decodedRedirectUrl = decodeURI(redirectUrl ?? "/");
    router.push(decodedRedirectUrl);
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
                    <Input placeholder="Graduate Status" {...field} />
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
                    defaultValue={field.value?.toString()}
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
                              checked={field.value?.includes(major)}
                              onCheckedChange={(checked: boolean) => {
                                if (major === "Other" && checked) {
                                  setMajorShowOther(true);
                                } else if (major === "Other" && !checked) {
                                  setMajorShowOther(false);
                                }
                                return checked
                                  ? field.onChange([...field.value, major])
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
            render={({ field }) => {
              if (!majorShowOther) {
                return <></>;
              }
              return (
                <FormItem>
                  <FormLabel>Other major</FormLabel>
                  <FormControl>
                    <Input placeholder="major" {...field} />
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
                              checked={field.value?.includes(ethnicity)}
                              onCheckedChange={(checked: boolean) => {
                                if (ethnicity === "Other" && checked) {
                                  setEthnicityShowOther(true);
                                } else if (ethnicity === "Other" && !checked) {
                                  setEthnicityShowOther(false);
                                }
                                return checked
                                  ? field.onChange([...field.value, ethnicity])
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
                    <Input placeholder="ethnicity" {...field} />
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
                      console.log(value === "Other");
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
                      <Input placeholder="Other" {...field} />
                    </FormControl>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loading /> : "Submit"}
            </Button>
            <Button
              onClick={() => router.back()}
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
          willing to answer them!
        </p>
      </CollapsibleContent>
    </Collapsible>
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
    <div className="fixed bottom-4 right-4">
      <div className="flex flex-col gap-2">
        <button
          onClick={scrollUp}
          className="flex h-32 w-32 items-center justify-center rounded-full border bg-white"
        >
          <ArrowUp size={64} />
        </button>
        <button
          onClick={scrollDown}
          className="flex h-32 w-32 items-center justify-center rounded-full border bg-white"
        >
          <ArrowDown size={64} />
        </button>
      </div>
    </div>
  );
}
