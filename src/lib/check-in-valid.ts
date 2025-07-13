import { addDays, isBefore } from "date-fns";

export function checkInValid(
  input: Date,
  now: Date | undefined = undefined,
): boolean {
  now ??= new Date();
  if (!(input instanceof Date) || isNaN(input.getTime())) {
    throw new Error("Invalid date input");
  }

  let expiry = new Date(input);
  expiry.setHours(4, 0, 0, 0);
  if (input.getHours() >= 4) {
    expiry = addDays(expiry, 1);
  }

  return isBefore(now, expiry);
}
