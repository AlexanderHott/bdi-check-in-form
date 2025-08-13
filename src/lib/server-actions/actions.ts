"use server";

import "server-only";

import type { CheckIn, NewCheckIn, Person } from "~/schemas";
import { env } from "~/env";
import * as nodemailer from "nodemailer";

import { checkInValid } from "../check-in-valid";
import { getDb } from "../db";

export async function getPerson(cardId: string): Promise<Person | null> {
  "use server";
  const db = getDb();
  return await db.table("people-new").get(cardId);
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
  if (!checkInValid(checkin.startTime, new Date())) {
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
  checkIn.startTime = new Date();

  await db.table(table).add(checkIn);
}

export async function postCheckOut(
  checkIn: CheckIn,
  table: "al-checkins-new" | "ml-checkins-new" | "dsl-checkins-new",
) {
  "use server";
  const db = getDb();
  await db.table(table).updateLast(checkIn.person.cardId, checkIn);
}

export async function postNewPerson(person: Person) {
  "use server";

  const db = getDb();

  await db.table("people-new").add(person);
}

export async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GOOGLE_EMAIL,
      pass: env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: env.GOOGLE_EMAIL,
    to: env.EMAIL_ALERT_TO,
    subject: "Hello from Node.js",
    text: "This is a test email sent using Gmail + app password in Node.js!",
  };

  await transporter.sendMail(mailOptions);
}
