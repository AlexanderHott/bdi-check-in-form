"use server";

import "server-only";

import type { CheckIn, Person } from "~/schemas";

import { getDb } from "./db";

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
