"use server";

import "server-only";

import type { CheckIn, Lab, NewCheckIn, Person } from "~/schemas";
import { render } from "@react-email/components";
import { SomethingWentWrongEmail } from "~/components/email/something-went-wrong";
import { env } from "~/env";
import * as nodemailer from "nodemailer";

import { checkInValid } from "../check-in-valid";
import { formatDateET } from "../date-format";
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

export async function sendEmail(checkin: CheckIn, lab: Lab) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GOOGLE_EMAIL,
      pass: env.GOOGLE_APP_PASSWORD,
    },
  });

  const htmlContent = await render(
    <SomethingWentWrongEmail
      checkinReasons={checkin.reasons}
      comment={checkin.comment ?? "<no comment>"}
      lab={lab.toUpperCase()}
      checkinTime={formatDateET(checkin.startTime)}
      checkoutTime={
        checkin.endTime ? formatDateET(checkin.endTime) : "<no checkout time>"
      }
      rating={checkin.rating ?? "<no rating>"}
      name={checkin.person.name}
      email={checkin.person.email}
    />,
  );

  const mailOptions = {
    from: env.GOOGLE_EMAIL,
    to: env.EMAIL_ALERT_TO,
    subject: `🚨 Something went wrong in the ${lab}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}
