import type { ScheetsSchema } from "~/lib/sheets";
import type { CheckIn, Person } from "~/schemas";
import { Sheets } from "~/lib/sheets";
import { checkInSchema, personSchema } from "~/schemas";
import { isValid, parse } from "date-fns";
import { z } from "zod";

function serializeCheckIn(checkIn: CheckIn) {
  return [
    checkIn.person.cardId,
    checkIn.person.email,
    checkIn.person.name,
    checkIn.person.graduateStatus,
    checkIn.person.graduatingYear ?? "",
    checkIn.person.graduateResearchStatus ?? "",
    checkIn.person.majors.join(";"),
    checkIn.person.ethnicities.join(";"),
    checkIn.person.gender,
    checkIn.reasons.join(";"),
    formatDateET(checkIn.createdAt),
  ];
}

const DATE_FORMAT = "MM/dd/yyyy HH:mm:ss";

const customDateSchema = z
  .string()
  .refine(
    (val) => {
      const parsed = parse(val, DATE_FORMAT, new Date());
      return isValid(parsed);
    },
    (val) => ({
      message: `Invalid date format, expected ${DATE_FORMAT}, got ${val}`,
    }),
  )
  .transform((val) => parse(val, DATE_FORMAT, new Date()));

function serializePerson(person: Person): unknown[] {
  return [
    person.cardId,
    person.email,
    person.name,
    person.graduateStatus,
    person.graduatingYear,
    person.graduateResearchStatus,
    person.majors.join(";"),
    person.ethnicities.join(";"),
    person.gender,
    formatDateET(person.createdAt),
  ];
}

function deserializePerson(data: unknown[]): Person | null {
  const [
    cardId,
    email,
    name,
    graduateStatus,
    graduatingYear,
    graduateResearchStatus,
    majors,
    ethnicities,
    gender,
    createdAt,
  ] = data;
  const personRaw = {
    cardId,
    email,
    name,
    graduateStatus,
    graduatingYear,
    graduateResearchStatus,
    majors: String(majors).split(";"),
    ethnicities: String(ethnicities).split(";"),
    gender,
    createdAt: customDateSchema.safeParse(createdAt).data,
  };
  return personSchema.safeParse(personRaw).data ?? null;
}

const tables = {
  "people-new": {
    serialize: serializePerson,
    deserialize: deserializePerson,
    getKey: (row: Person) => row.cardId,
  },
  "al-checkins-new": {
    serialize: (row: CheckIn) => serializeCheckIn(row),
    deserialize: (data: unknown[]) =>
      checkInSchema.safeParse(data).data ?? null,
    getKey: (row: CheckIn) => row.person.cardId,
  },
  "ml-checkins-new": {
    serialize: (row: CheckIn) => serializeCheckIn(row),
    deserialize: (data: unknown[]) =>
      checkInSchema.safeParse(data).data ?? null,
    getKey: (row: CheckIn) => row.person.cardId,
  },
  "dsl-checkins-new": {
    serialize: (row: CheckIn) => serializeCheckIn(row),
    deserialize: (data: unknown[]) =>
      checkInSchema.safeParse(data).data ?? null,
    getKey: (row: CheckIn) => row.person.cardId,
  },
} as const satisfies ScheetsSchema;

export const getDb = () => new Sheets(tables);

export function formatDateET(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/\//g, "/")
    .replaceAll(",", "");
}
