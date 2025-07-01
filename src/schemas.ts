/**
 * This file contains the validation schemas and general config for the app.
 *
 * Since data comes from both a form and from google sheets, we have to double model the data
 * - one for the in-progress form where users can type out extra answers in the "other fields"
 * - one for the tuple respones that we get back from google sheets
 *
 * The tuple respone is transformed into an object as part of the parsing (done via zod.transform).
 */
import { isValid, parse } from "date-fns";
import { z } from "zod";

const FORMAT = "MM/dd/yyyy HH:mm:ss";

const customDateSchema = z
  .string()
  .refine(
    (val) => {
      const parsed = parse(val, FORMAT, new Date());
      return isValid(parsed);
    },
    (val) => ({
      message: `Invalid date format, expected ${FORMAT}, got ${val}`,
    }),
  )
  .transform((val) => parse(val, FORMAT, new Date()));

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

// FIXME: maybe make a getYears function because this will be out of date if not deployed every year
export const YEARS = Array(5)
  .fill(0)
  .map((_, i) => (new Date().getFullYear() + i).toString());

// Empty strings are "null values"
export const newPersonFormSchema = z
  .object({
    cardId: z.string().length(15),
    email: z.string().email(),
    name: z
      .string()
      .min(1, { message: "Name must contain at least 1 character" })
      .regex(/^[A-Za-z.,\s]+$/, "Only alphabetical characters are allowed"),
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
        (
          data.graduateStatus.includes("Student") &&
          data.graduatingYear === ""
        )
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
    createdAt: new Date(),
  };
}

// transform must be after all validation (refine, pipe, etc.)
// https://github.com/colinhacks/zod/issues/2243
// https://github.com/colinhacks/zod/issues/2192
// https://github.com/colinhacks/zod/issues/2113
export const personSchema = z
  .tuple([
    z.string().length(15), // cardId
    z.string().email(), // email
    z.string().min(1), // name
    z.enum(GRADUATE_STATUS).or(z.string()), // graduateStatus
    z.string().optional(), // graduatingYear
    z.string().optional(), // graduateResearchStatus
    z
      .string()
      .transform((majorString) => majorString.split(";"))
      .pipe(z.array(z.enum(MAJORS).or(z.string()))), // majors
    z
      .string()
      .transform((ethnicityString) => ethnicityString.split(";"))
      .pipe(z.array(z.enum(ETHNICITIES).or(z.string()))), // ethnicities
    z.enum(GENDERS).or(z.string()), // gender
    customDateSchema,
  ])
  .refine(
    ([
      _cardId,
      _email,
      _name,
      graduateStatus,
      graduatingYear,
      _graduateResearchStatus,
      _majors,
      _ethnicities,
      _gender,
      _createdAt,
    ]) => {
      return !(
        graduateStatus.includes("Student") && graduatingYear === undefined
      );
    },
    {
      message: "Graduation Year is required when you are a student",
      path: ["graduateStatus"],
    },
  )
  .transform(
    ([
      cardId,
      email,
      name,
      graduateStatus,
      graduatingYear,
      graduateResearchStatus,
      majors,
      ethnicities,
      gender,
      createdAt,
    ]) => {
      return {
        cardId,
        email,
        name,
        graduateStatus,
        graduatingYear,
        graduateResearchStatus,
        majors,
        ethnicities,
        gender,
        createdAt,
      };
    },
  );

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
] as const;

export const checkInSchema = z.object({
      person: personSchema,
      reasons: z.array(z.string().min(1)),
      reasonOther: z.string(),
      createdAt: customDateSchema,
    })
    .refine(
      (data) =>
        !(data.reasons.length === 0 && data.reasonOther.trim().length === 0),
      {
        message: "You must have at least 1 reason or fill out the Other field",
        path: ["reasons"],
      },
    );

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
} as const satisfies Record<string, { reasons: readonly string[], sheetName: string }>;

export type Lab = keyof typeof CONFIG;