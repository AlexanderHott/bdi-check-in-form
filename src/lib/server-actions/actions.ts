"use server";

import "server-only";

import type { CheckIn, NewCheckIn, Person } from "~/schemas";

import { getDb } from "../db";

export async function getPerson(cardId: string): Promise<Person | null> {
  "use server";
  const db = getDb();
  return await db.table("people-new").get(cardId);
}

function isTooOld(input: Date): boolean {
  if (!(input instanceof Date) || isNaN(input.getTime())) {
    throw new Error("Invalid date input");
  }

  const expiry = new Date(input);
  expiry.setHours(4, 0, 0, 0);

  return input < expiry;
}

export async function getRecentCheckin(
  table: "al-checkins-new" | "ml-checkins-new" | "dsl-checkins-new",
  cardId: string,
): Promise<CheckIn | null> {
  "use server";

  const db = getDb();
  const checkin = await db.table(table).getLast(cardId);
  if (checkin === null) {
    return null;
  }
  if (isTooOld(checkin.createdAt)) {
    return null;
  }
  return checkin;
}

export async function postCheckIn(
  checkIn: NewCheckIn,
  table: "al-checkins-new" | "ml-checkins-new" | "dsl-checkins-new",
) {
  "use server";
  const db = getDb();

  if (checkIn.reasonOther) {
    checkIn.reasons.push(checkIn.reasonOther);
  }
  checkIn.createdAt = new Date();

  await db.table(table).add(checkIn);
}

export async function postNewPerson(person: Person) {
  "use server";

  const db = getDb();

  await db.table("people-new").add(person);
}
