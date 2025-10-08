import { parse } from "date-fns";
import { describe, expect, test } from "vitest";

import { checkInValid } from "./check-in-valid";

const dates = [
  {
    date: parse("2025/01/01 00:00:00", "yyyy/MM/dd HH:mm:ss", new Date()),
    now: parse("2025/01/01 09:00:00", "yyyy/MM/dd HH:mm:ss", new Date()),
    valid: false,
  },
  {
    date: parse("2025/01/01 05:00:00", "yyyy/MM/dd HH:mm:ss", new Date()),
    now: parse("2025/01/01 09:00:00", "yyyy/MM/dd HH:mm:ss", new Date()),
    valid: true,
  },
  {
    date: parse("2025/01/01 05:00:00", "yyyy/MM/dd HH:mm:ss", new Date()),
    now: parse("2025/02/01 09:00:00", "yyyy/MM/dd HH:mm:ss", new Date()),
    valid: false,
  },
];

describe.each(dates)("checkInValid", ({ date, now, valid }) => {
  test(`${date.toString()} is valid`, () => {
    expect(checkInValid(date, now)).toBe(valid);
  });
});
