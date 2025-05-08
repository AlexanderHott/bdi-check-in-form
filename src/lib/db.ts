"use server";

import "server-only";

import type { ScheetsSchema } from "~/lib/sheets";
import type {
  AlCheckIn,
  CheckIn,
  DslCheckIn,
  MlCheckIn,
  Person,
} from "~/schemas";
import { Sheets } from "~/lib/sheets";
import {
  alCheckInSchema,
  dslCheckInSchema,
  mlCheckInSchema,
  personSchema,
} from "~/schemas";

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

const tables = {
  "people-new": {
    serialize: (row: Person) => [
      row.cardId,
      row.email,
      row.name,
      row.graduateStatus,
      row.graduatingYear ?? "",
      row.graduateResearchStatus ?? "",
      row.majors.join(";"),
      row.ethnicities.join(";"),
      row.gender,
      formatDateET(row.createdAt),
    ],
    deserialize: (data: unknown[]) => personSchema.safeParse(data).data ?? null,
    getKey: (row: Person) => row.cardId,
  },
  "al-checkins-new": {
    serialize: (row: AlCheckIn) => serializeCheckIn(row),
    deserialize: (data: unknown[]) =>
      alCheckInSchema.safeParse(data).data ?? null,
    getKey: (row: AlCheckIn) => row.person.cardId,
  },
  "ml-checkins-new": {
    serialize: (row: MlCheckIn) => serializeCheckIn(row),
    deserialize: (data: unknown[]) =>
      mlCheckInSchema.safeParse(data).data ?? null,
    getKey: (row: MlCheckIn) => row.person.cardId,
  },
  "dsl-checkins-new": {
    serialize: (row: DslCheckIn) => serializeCheckIn(row),
    deserialize: (data: unknown[]) =>
      dslCheckInSchema.safeParse(data).data ?? null,
    getKey: (row: DslCheckIn) => row.person.cardId,
  },
} as const satisfies ScheetsSchema;

export const getDb = () => new Sheets(tables);

const formatDateET = (date: Date) => {
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
};

export async function getPerson(cardId: string): Promise<Person | null> {
  const db = getDb();
  return await db.table("people-new").get(cardId);
}

export async function postCheckIn(
  checkIn: CheckIn,
  table: "al-checkins-new" | "ml-checkins-new" | "dsl-checkins-new",
) {
  const db = getDb();

  const reasons: string[] = checkIn.reasons;
  if (checkIn.reasonOther) {
    reasons.push(checkIn.reasonOther);
  }
  checkIn.createdAt = new Date();

  await db.table(table).add(checkIn);
}

export async function postNewPerson(person: Person) {
  const db = getDb();

  await db.table("people-new").add(person);
}
