/**
 * This file contains the validation schemas and general config for the app.
 *
 * Since data comes from both a form and from google sheets, we have to double model the data
 * - one for the in-progress form where users can type out extra answers in the "other fields"
 * - one for the tuple respones that we get back from google sheets
 *
 * The tuple respone is transformed into an object as part of the parsing (done via zod.transform).
 */
import { z } from "zod";

export const GRADUATE_STATUS = [
  "Undergraduate Student",
  "Graduate Student",
  "Staff",
  "Faculty",
  "Alum",
  "Other",
] as const;

export const MAJORS = [
  "STEM",
  "Social sciences",
  "Humanities",
  "Business School",
  "Art",
  "Other",
] as const;

export const ETHNICITIES = [
  "White",
  "Black or African American",
  "American Indian or Alaska Native",
  "Asian",
  "Native Hawaiian or Other Pacific Islander",
  "Prefer not to answer",
  "Other",
] as const;

export const GENDERS = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to answer",
  "Other",
] as const;

export function getYears() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }).map((_, i) => (currentYear + i).toString());
}

// Empty strings are "null values"
export const newPersonFormSchema = z
  .object({
    cardId: z.string().length(15),
    email: z.email(),
    name: z
      .string()
      .min(1, { message: "Name must contain at least 1 character" })
      .regex(
        /^[A-Za-z.,\s]+$/,
        "Only letters, spaces, and periods are allowed",
      ),
    graduateStatus: z.enum(GRADUATE_STATUS),
    graduateStatusOther: z.string(),
    graduatingYear: z.string(),
    graduateResearchStatus: z.string(),
    majors: z
      .array(z.enum(MAJORS))
      .min(1, { message: "Please select at least 1 major" }),
    majorOther: z.string(),
    ethnicities: z
      .array(z.enum(ETHNICITIES))
      .min(1, { message: "Please select at least 1 ethnicity" }),
    ethnicityOther: z.string(),
    gender: z.enum(GENDERS),
    genderOther: z.string(),
  })
  // NOTE: return false to signify failure
  .refine(
    (data) =>
      !(
        // read as: "this fails if ..."
        (data.graduateStatus.includes("Student") && data.graduatingYear === "")
      ),
    {
      message: "Graduation Year is required when you are a student",
      path: ["graduateStatus"],
    },
  )
  .refine(
    (data) =>
      !(
        data.majors.filter((major) => major !== "Other").length === 0 &&
        data.majorOther.length === 0
      ),
    {
      message: "You must select at least 1 major",
      path: ["majorOther"],
    },
  )
  .refine(
    (data) =>
      !(
        data.ethnicities.filter((ethnicity) => ethnicity !== "Other").length ===
          0 && data.ethnicityOther.length === 0
      ),
    {
      message: "You must select at least 1 ethnicity option",
      path: ["ethnicityOther"],
    },
  )
  .refine(
    (data) => !(data.gender === "Other" && data.genderOther.length === 0),
    {
      message: "You must select a gender option",
      path: ["genderOther"],
    },
  );

export function newPersonFormSchemaToPerson(
  data: z.infer<typeof newPersonFormSchema>,
): Person {
  const majors: string[] = data.majors.filter((major) => major !== "Other");
  if (data.majorOther) {
    majors.push(`other:${data.majorOther}`);
  }

  const ethnicities: string[] = data.ethnicities.filter(
    (ethnicity) => ethnicity !== "Other",
  );
  if (data.ethnicityOther) {
    ethnicities.push(`other:${data.ethnicityOther}`);
  }

  let graduateStatus: string = data.graduateStatus;
  if (data.graduateStatusOther) {
    graduateStatus = `other:${data.graduateStatusOther}`;
  }

  let gender: string = data.gender;
  if (data.genderOther) {
    gender = `other:${data.genderOther}`;
  }

  return {
    ...data,
    gender,
    majors,
    ethnicities,
    graduateStatus,
  };
}

export const personSchema = z.object({
  cardId: z.string().length(15), // cardId
  email: z.email(), // email
  name: z.string().min(1), // name
  graduateStatus: z.enum(GRADUATE_STATUS).or(z.string()), // graduateStatus
  graduatingYear: z.string().optional(), // graduatingYear
  graduateResearchStatus: z.string().optional(), // graduateResearchStatus
  majors: z.array(z.enum(MAJORS).or(z.string())), // majors
  ethnicities: z.array(z.enum(ETHNICITIES).or(z.string())), // ethnicities
  gender: z.enum(GENDERS).or(z.string()), // gender
});
export type Person = z.infer<typeof personSchema>;

export const ML_REASONS = [
  "Workshop or Event",
  "3D Printing",
  "Sewing",
  "Laser Cutting",
  "Hand Tools",
  "Vinyl Cutting",
  "Consultation",
  "Club Meeting",
  "BDI staff meeting",
] as const;

export const AL_REASONS = [
  "Workshop or Event",
  "Soldering",
  "CNC",
  "Laser Cutting",
  "Electronics",
  "Hand Tools",
  "Consultation",
  "Club Meeting",
  "BDI staff meeting",
] as const;

export const DSL_REASONS = [
  "Workshop or Event",
  "GIS / Survey Work",
  "CAD / 3D modeling",
  "3D Scanning",
  "High Performance Computing",
  "Equipment Lending",
  "Consultation",
  "Club Meeting",
  "BDI staff meeting",
] as const;

export const newCheckInFormSchema = z
  .object({
    person: personSchema,
    reasons: z.array(z.string()),
    reasonOther: z.string(),
    startTime: z.date(),
  })
  .refine(
    (data) =>
      !(data.reasons.length === 0 && data.reasonOther.trim().length === 0),
    {
      message: "You must have at least 1 reason or fill out the Other field",
      path: ["reasons"],
    },
  );
export type NewCheckIn = z.infer<typeof newCheckInFormSchema>;

export const checkInSchema = z.object({
  person: personSchema,
  reasons: z.array(z.string().min(1)),
  startTime: z.date(),
  endTime: z.date().optional(),
  rating: z.string().optional(),
  comment: z.string().optional(),
});

export type CheckIn = z.infer<typeof checkInSchema>;

export const CONFIG = {
  al: {
    reasons: AL_REASONS,
    sheetName: "al-checkins-new",
  },
  ml: {
    reasons: ML_REASONS,
    sheetName: "ml-checkins-new",
  },
  dsl: {
    reasons: DSL_REASONS,
    sheetName: "dsl-checkins-new",
  },
} as const satisfies Record<
  string,
  Readonly<{ reasons: readonly string[]; sheetName: string }>
>;

export type Lab = keyof typeof CONFIG;
