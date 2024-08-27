"use server";

import { google } from "googleapis";
import { env } from "~/env";

export type Person = {
  cardId: string;
  email: string;
  name: string;
  gender: string;
  ethnicity: string;
};

export async function getPerson(cardId: string): Promise<Person | undefined> {
  const auth = new google.auth.JWT({
    email: env.CLIENT_EMAIL,
    key: env.PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheet = google.sheets("v4");

  let rows: unknown[][] | null | undefined;
  try {
    const rowsRes = await sheet.spreadsheets.values.get({
      spreadsheetId: env.SHEET_ID,
      auth,
      range: "people",
    });
    rows = rowsRes.data.values;
  } catch (e) {
    console.error(e);
  }
  console.log("rows", rows);

  const row = rows?.find((row) => row[0] === cardId);
  console.log("row", row);
  if (!row) return undefined;

  return {
    cardId: row[0] as string,
    email: row[1] as string,
    name: row[2] as string,
    gender: row[3] as string,
    ethnicity: row[4] as string,
  };
}

export type CheckIn = {
  cardId: string;
  email: string;
  name: string;
  gender: string;
  ethnicity: string;
  reasons: string[];
};

export async function postCheckIn(checkIn: CheckIn, table: string) {
  console.log("checkin", checkIn);
  const auth = new google.auth.JWT({
    email: env.CLIENT_EMAIL,
    key: env.PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheet = google.sheets("v4");

  await sheet.spreadsheets.values.append({
    spreadsheetId: env.SHEET_ID,
    auth: auth,
    range: table,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          checkIn.cardId,
          checkIn.email,
          checkIn.name,
          checkIn.gender,
          checkIn.ethnicity,
          checkIn.reasons.join(";"),
        ],
      ],
    },
  });
}

export async function postNewPerson(person: Person) {
  const auth = new google.auth.JWT({
    email: env.CLIENT_EMAIL,
    key: env.PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheet = google.sheets("v4");

  await sheet.spreadsheets.values.append({
    spreadsheetId: env.SHEET_ID,
    auth: auth,
    range: "people",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          person.cardId,
          person.email,
          person.name,
          person.gender,
          person.ethnicity,
        ],
      ],
    },
  });
}
