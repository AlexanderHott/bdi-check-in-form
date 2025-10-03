import { parse } from "date-fns";
import { describe, expect, test } from "vitest";

import { formatDateET } from "./date-format";

describe.each([
  {
    date: parse("01/01/2025 00:00:00", "MM/dd/yyyy HH:mm:ss", new Date()),
    formattedDate: "01/01/2025 00:00:00",
  },
  {
    date: parse("01/01/2025 05:00:00", "MM/dd/yyyy HH:mm:ss", new Date()),
    formattedDate: "01/01/2025 05:00:00",
  },
])("formatDateET", ({ date, formattedDate }) => {
  test(`${date.toString()} is ${formattedDate}:`, () => {
    expect(formatDateET(date)).toBe(formattedDate);
  });
});
