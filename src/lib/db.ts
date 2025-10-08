import type { ScheetsSchema } from "~/lib/sheets";
import type { CheckIn, Person } from "~/schemas";
import { formatDateET } from "~/lib/date-format";
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
    formatDateET(checkIn.startTime),
    checkIn.endTime ? formatDateET(checkIn.endTime) : undefined,
    checkIn.rating,
    checkIn.comment,
  ];
}

function deserializeCheckIn(data: unknown[]): CheckIn | null {
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
    reasons,
    startTime,
    endTime,
    rating,
    comment,
  ] = data;
  const checkInRaw = {
    person: {
      cardId,
      email,
      name,
      graduateStatus,
      graduatingYear,
      graduateResearchStatus,
      majors: String(majors).split(";"),
      ethnicities: String(ethnicities).split(";"),
      gender,
    },
    reasons: String(reasons).split(";"),
    startTime: customDateSchema.safeParse(startTime).data,
    endTime: customDateSchema.safeParse(endTime).data,
    rating,
    comment,
  };
  // return checkInSchema.safeParse(checkInRaw).data ?? null;
  const parsed = checkInSchema.safeParse(checkInRaw);
  if (parsed.error) {
    console.error("error parsing checkin", parsed.error.message);
    console.error(checkInRaw);
  }
  return parsed.data ?? null;
}

const DATE_FORMAT = "MM/dd/yyyy HH:mm:ss";

const customDateSchema = z
  .string()
  .refine(
    (val) => {
      const parsed = parse(val, DATE_FORMAT, new Date());
      return isValid(parsed);
    },
    // (val) => ({
    //   message: `Invalid date format, expected ${DATE_FORMAT}, got ${val}`,
    // }),
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
    startTime,
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
    startTime: customDateSchema.safeParse(startTime).data,
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
    deserialize: deserializeCheckIn,
    getKey: (row: CheckIn) => row.person.cardId,
  },
  "ml-checkins-new": {
    serialize: (row: CheckIn) => serializeCheckIn(row),
    deserialize: deserializeCheckIn,
    getKey: (row: CheckIn) => row.person.cardId,
  },
  "dsl-checkins-new": {
    serialize: (row: CheckIn) => serializeCheckIn(row),
    deserialize: deserializeCheckIn,
    getKey: (row: CheckIn) => row.person.cardId,
  },
} as const satisfies ScheetsSchema;

export const getDb = () => new Sheets(tables);
