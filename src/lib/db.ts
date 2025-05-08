"use server";

import type { CheckIn, Person } from "~/schemas";
import { personSchema } from "~/schemas";

import type { ScheetsSchema } from "./sheets";
import { Sheets } from "./sheets";

const tables = {
  "people-new": {
    serialize: (row: Person) => [
      row.cardId,
      row.email,
      row.name,
      row.graduateStatus,
      row.graduatingYear,
      row.graduateResearch,
      row.majors.join(";"),
      row.ethnicities.join(";"),
      row.gender,
    ],
    deserialize: (data: unknown[]) => personSchema.safeParse(data).data ?? null,
    getKey: (row: Person) => row.cardId,
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
function getTimestamp() {
  return formatDateET(new Date());
}

export async function getPerson(cardId: string): Promise<Person | null> {
  const db = getDb();
  return await db.table("people-new").get(cardId);
}

export async function postCheckIn(checkIn: CheckIn, table: string) {
  console.log("checkin", checkIn);
  // const auth = authGoogle();
  // const sheet = google.sheets("v4");

  const now = getTimestamp();

  const reasons: string[] = checkIn.reasons;
  if (checkIn.reasonOther) {
    reasons.push(checkIn.reasonOther);
  }

  await sheet.spreadsheets.values.append({
    spreadsheetId: env.SHEET_ID,
    auth: auth,
    range: table,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          checkIn.person.cardId,
          checkIn.person.email,
          checkIn.person.name,
          checkIn.person.graduateStatus,
          checkIn.person.graduatingYear ?? "",
          checkIn.person.graduateResearchStatus ?? "",
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

  const now = getTimestamp();

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
    valueInputOption: "USER_ENTERED",
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
