"use client";

import type { CheckIn, Lab } from "~/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MUTATIONS } from "~/lib/server-actions";
import { cn } from "~/lib/utils";
import { CONFIG } from "~/schemas";
import { Loader2 } from "lucide-react";
// import { formatDuration, intervalToDuration } from "date-fns";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

const checkOutSchema = z.object({
  rating: z.number().min(1).max(4),
  somethingBroken: z.boolean(),
  comment: z.string().optional(),
  endTime: z.date(),
});
type CheckOut = z.infer<typeof checkOutSchema>;

export function CheckOutForm({
  checkin,
  lab,
  redirectUrl,
}: Readonly<{ checkin: CheckIn; lab: Lab; redirectUrl: string }>) {
  const config = CONFIG[lab];
  const form = useForm<CheckOut>({
    resolver: zodResolver(checkOutSchema),
    defaultValues: {
      rating: undefined,
      somethingBroken: false,
      comment: "",
      endTime: new Date(),
    },
  });
  const somethingBroken = useWatch({
    control: form.control,
    name: "somethingBroken",
    exact: true,
  });
  // const endTime = useWatch({
  //   control: form.control,
  //   name: "endTime",
  //   exact: true,
  // });
  const router = useRouter();

  const onSubmit = async (data: CheckOut) => {
    console.log("on submit", data);
    const checkinWithRating = {
      ...checkin,
      rating: data.rating.toString(),
      endTime: new Date(),
      comment: data.comment,
    };
    console.log("checkinWithRating", checkinWithRating);
    await MUTATIONS.postCheckOut(checkinWithRating, config.sheetName);
    if (checkinWithRating.comment) {
      await MUTATIONS.sendEmail(checkinWithRating, lab);
    }
    console.log("redirecting to", redirectUrl);
    router.push(redirectUrl);
  };

  // const startTimeText = checkin.startTime.toLocaleTimeString();
  // const endTimeText = endTime.toLocaleTimeString();
  // const durationText = formatDuration(
  //   intervalToDuration({ start: checkin.startTime, end: endTime }),
  //   { format: ["hours", "minutes"] },
  // );

  return (
    <div>
      <h2 className="text-2xl">See you next time, {checkin.person.name}!</h2>
      {/* <div>
        <p>{`${startTimeText} - ${endTimeText} (${durationText})`}</p>
        <p>You checked in for {checkin.reasons.join(", ")}</p>
      </div> */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="rating"
            render={() => (
              <FormItem>
                <FormLabel>How did it go?</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <FormField
                      key={i}
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <FormLabel className="font-normal">
                            <Card
                              className={cn(
                                "cursor-pointer",
                                field.value === i + 1 &&
                                  "border-blue-500 bg-blue-100",
                              )}
                            >
                              <CardHeader className="flex flex-row items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    className="hidden"
                                    checked={field.value === i + 1}
                                    onCheckedChange={(checked: boolean) => {
                                      if (checked) {
                                        field.onChange(i + 1);
                                      } else {
                                        field.onChange(undefined);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <RatingFace rating={i + 1} />
                              </CardHeader>
                            </Card>
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="somethingBroken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Card className="has-[[aria-checked=true]]:border-amber-600 has-[[aria-checked=true]]:bg-amber-50 dark:has-[[aria-checked=true]]:border-amber-900 dark:has-[[aria-checked=true]]:bg-amber-950 cursor-pointer">
                    <CardContent className="flex items-start gap-4 p-4">
                      <FormControl>
                        <Checkbox
                          className="data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white dark:data-[state=checked]:border-amber-700 dark:data-[state=checked]:bg-amber-700"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          Notify staff: was something broken or missing?
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {
                            "You aren't in trouble if you broke it, but please let us know"
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          {somethingBroken && (
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What went wrong? (will be emailed to staff)
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>

          {/* <p>dont forget to return your items</p> */}
        </form>
      </Form>
    </div>
  );
}

function RatingFace({ rating }: { rating: number }) {
  if (rating === 1) {
    return <FaceSad className="h-8 w-8" />;
  }
  if (rating === 2) {
    return <FaceUnhappy className="h-8 w-8" />;
  }
  if (rating === 3) {
    return <FaceHappy className="h-8 w-8" />;
  }
  if (rating === 4) {
    return <FaceSmile className="h-8 w-8" />;
  }
  throw new Error(`Invalid rating: ${String(rating)}`);
}

function FaceSmile(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-testid="geist-icon"
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.5 8.97498H3.875V9.59998C3.875 11.4747 5.81046 12.8637 7.99817 12.8637C10.1879 12.8637 12.125 11.4832 12.125 9.59998V8.97498H11.5H4.5ZM7.99817 11.6137C6.59406 11.6137 5.63842 10.9482 5.28118 10.225H10.7202C10.3641 10.9504 9.40797 11.6137 7.99817 11.6137Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.15295 4.92093L5.375 3.5L4.59705 4.92093L3 5.21885L4.11625 6.39495L3.90717 8L5.375 7.30593L6.84283 8L6.63375 6.39495L7.75 5.21885L6.15295 4.92093ZM11.403 4.92093L10.625 3.5L9.84705 4.92093L8.25 5.21885L9.36625 6.39495L9.15717 8L10.625 7.30593L12.0928 8L11.8837 6.39495L13 5.21885L11.403 4.92093Z"
        fill="var(--color-amber-600)"
      ></path>
    </svg>
  );
}

function FaceHappy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5249 10.8478L11.8727 10.3286L10.8342 9.6329L10.4863 10.1522C9.94904 10.9543 9.0363 11.4802 8.00098 11.4802C6.96759 11.4802 6.05634 10.9563 5.51863 10.1567L5.16986 9.63804L4.13259 10.3356L4.48137 10.8542C5.2414 11.9844 6.53398 12.7302 8.00098 12.7302C9.47073 12.7302 10.7654 11.9816 11.5249 10.8478ZM6.75 6.75C6.75 7.30228 6.30228 7.75 5.75 7.75C5.19772 7.75 4.75 7.30228 4.75 6.75C4.75 6.19772 5.19772 5.75 5.75 5.75C6.30228 5.75 6.75 6.19772 6.75 6.75ZM10.25 7.75C10.8023 7.75 11.25 7.30228 11.25 6.75C11.25 6.19772 10.8023 5.75 10.25 5.75C9.69771 5.75 9.25 6.19772 9.25 6.75C9.25 7.30228 9.69771 7.75 10.25 7.75Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function FaceUnhappy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM5.75 7.75C6.30228 7.75 6.75 7.30228 6.75 6.75C6.75 6.19772 6.30228 5.75 5.75 5.75C5.19772 5.75 4.75 6.19772 4.75 6.75C4.75 7.30228 5.19772 7.75 5.75 7.75ZM11.25 6.75C11.25 7.30228 10.8023 7.75 10.25 7.75C9.69771 7.75 9.25 7.30228 9.25 6.75C9.25 6.19772 9.69771 5.75 10.25 5.75C10.8023 5.75 11.25 6.19772 11.25 6.75ZM11.5249 11.2622L11.8727 11.7814L10.8342 12.4771L10.4863 11.9578C9.94904 11.1557 9.0363 10.6298 8.00098 10.6298C6.96759 10.6298 6.05634 11.1537 5.51863 11.9533L5.16986 12.4719L4.13259 11.7744L4.48137 11.2558C5.2414 10.1256 6.53398 9.37982 8.00098 9.37982C9.47073 9.37982 10.7654 10.1284 11.5249 11.2622Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function FaceSad(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width="16"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 9V16H5.5V9H4ZM12 9V16H10.5V9H12Z"
        fill="var(--color-blue-700)"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 9.57941 13.9367 11.0273 13 12.1536V14.2454C14.8289 12.7793 16 10.5264 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 10.5264 1.17107 12.7793 3 14.2454V12.1536C2.06332 11.0273 1.5 9.57941 1.5 8ZM8 14.5C8.51627 14.5 9.01848 14.4398 9.5 14.3261V15.8596C9.01412 15.9518 8.51269 16 8 16C7.48731 16 6.98588 15.9518 6.5 15.8596V14.3261C6.98152 14.4398 7.48373 14.5 8 14.5ZM3.78568 8.36533C4.15863 7.98474 4.67623 7.75 5.25 7.75C5.82377 7.75 6.34137 7.98474 6.71432 8.36533L7.78568 7.31548C7.14222 6.65884 6.24318 6.25 5.25 6.25C4.25682 6.25 3.35778 6.65884 2.71432 7.31548L3.78568 8.36533ZM10.75 7.75C10.1762 7.75 9.65863 7.98474 9.28568 8.36533L8.21432 7.31548C8.85778 6.65884 9.75682 6.25 10.75 6.25C11.7432 6.25 12.6422 6.65884 13.2857 7.31548L12.2143 8.36533C11.8414 7.98474 11.3238 7.75 10.75 7.75ZM6.25 12H9.75C9.75 11.0335 8.9665 10.25 8 10.25C7.0335 10.25 6.25 11.0335 6.25 12Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
