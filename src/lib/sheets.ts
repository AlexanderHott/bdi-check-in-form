"use server";

import { google } from "googleapis";
import { env } from "~/env";
import {
  type CheckIn,
  type NewPerson,
  type Person,
  personSchema,
} from "~/schemas";

function authGoogle() {
  return new google.auth.JWT({
    email: env.CLIENT_EMAIL,
    key: env.PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function getPerson(cardId: string): Promise<Person | undefined> {
  const auth = authGoogle();
  const sheet = google.sheets("v4");

  let rows: unknown[][] | null | undefined;
  try {
    const rowsRes = await sheet.spreadsheets.values.get({
      spreadsheetId: env.SHEET_ID,
      auth,
      range: "people-new",
    });
    rows = rowsRes.data.values;
  } catch (e) {
    console.error(e);
  }

  const row = rows?.find((row) => row[0] === cardId);
  console.log("row", row);
  if (!row) return undefined;

  const parseResult = personSchema.safeParse({
    cardId: row[0],
    email: row[1],
    name: row[2],
    gender: row[3],
    ethnicities: (row[4] as string).split(";"),
    majors: (row[5] as string).split(";"),
    graduateStatus: row[6],
    graduatingYear: row[7],
  });

  if (!parseResult.success) {
    console.log("error parsing row", parseResult.error);
    return undefined;
  }
  return parseResult.data;
}

export async function postCheckIn(checkIn: CheckIn, table: string) {
  console.log("checkin", checkIn);
  const auth = authGoogle();
  const sheet = google.sheets("v4");

  const now = new Date().toISOString();

  const reasons: string[] = checkIn.reasons;
  if (checkIn.reasonOther) {
    reasons.push(checkIn.reasonOther);
  }

  await sheet.spreadsheets.values.append({
    spreadsheetId: env.SHEET_ID,
    auth: auth,
    range: table,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          checkIn.person.cardId,
          checkIn.person.email,
          checkIn.person.name,
          checkIn.person.graduateStatus,
          checkIn.person.graduatingYear ?? "",
          checkIn.person.majors.join(";"),
          checkIn.person.ethnicities.join(";"),
          checkIn.person.gender,
          reasons.join(";"),
          now,
        ],
      ],
    },
  });
}

export async function postNewPerson(person: NewPerson) {
  console.log("new person", person);
  const auth = authGoogle();
  const sheet = google.sheets("v4");

  const now = new Date().toISOString();

  const majors: string[] = person.majors.filter((maj) => maj !== "Other");
  if (person.majorOther) {
    majors.push(`other:${person.majorOther}`);
  }

  const ethnicities: string[] = person.ethnicities.filter(
    (eth) => eth !== "Other",
  );
  if (person.ethnicityOther) {
    ethnicities.push(`other:${person.ethnicityOther}`);
  }

  let graduateStatus: string = person.graduateStatus;
  if (person.graduateStatusOther) {
    graduateStatus = person.graduateStatusOther;
  }

  await sheet.spreadsheets.values.append({
    spreadsheetId: env.SHEET_ID,
    auth: auth,
    range: "people-new",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          person.cardId,
          person.email,
          person.name,
          graduateStatus,
          person.graduatingYear ?? "",
          person.graduateResearchStatus ?? "",
          majors.join(";"),
          ethnicities.join(";"),
          person.gender,
          now,
        ],
      ],
    },
  });
}
