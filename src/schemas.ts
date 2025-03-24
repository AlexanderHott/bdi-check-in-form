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

// FIXME: maybe make a getYears function because this will be out of date if not deployed every year
export const YEARS = Array(5)
  .fill(0)
  .map((_, i) => (new Date().getFullYear() + i).toString());

export const newPersonSchema = z
  .object({
    cardId: z.string().length(15),
    email: z.string().email(),
    name: z
      .string()
      .min(1, { message: "Name must contain at least 1 character(s)" })
      .regex(/^[A-Za-z]+$/, "Only alphabetical characters are allowed"),
    graduateStatus: z.enum(GRADUATE_STATUS),
    graduateStatusOther: z.string().optional(),
    graduatingYear: z.string().optional(),
    graduateResearchStatus: z.string().optional(),
    majors: z
      .array(z.enum(MAJORS))
      .min(1, { message: "Please select at least 1 major" }),
    majorOther: z.string(),
    ethnicities: z
      .array(z.enum(ETHNICITIES))
      .min(1, { message: "Please select at least 1 ethnicity" }),
    ethnicityOther: z.string(),
    gender: z.enum(GENDERS),
    genderOther: z.string().optional(),
  })
  // NOTE: return false to signify failure
  .refine(
    (data) =>
      !(
        data.graduateStatus.includes("Student") &&
        data.graduatingYear === undefined
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
      message: "Major must contain at least 1 character(s)",
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
      message: "Ethnicity must contain at least 1 character(s)",
      path: ["ethnicityOther"],
    },
  )
  .refine(
    (data) => !(data.gender === "Other" && data.genderOther?.length === 0),
    {
      message: "Gender must contain at least 1 character(s)",
      path: ["genderOther"],
    },
  );

export type NewPerson = z.infer<typeof newPersonSchema>;

export const personSchema = z
  .object({
    cardId: z.string().length(15),
    email: z.string().email(),
    name: z.string().min(1),
    graduateStatus: z.enum(GRADUATE_STATUS).or(z.string()),
    graduatingYear: z.string().optional(),
    graduateResearchStatus: z.string().optional(),
    majors: z.array(z.enum(MAJORS).or(z.string())),
    ethnicities: z.array(z.enum(ETHNICITIES).or(z.string())),
    gender: z.enum(GENDERS).or(z.string()),
  })
  .refine(
    (data) =>
      !(
        data.graduateStatus.includes("Student") &&
        data.graduatingYear === undefined
      ),
    {
      message: "Graduation Year is required when you are a student",
      path: ["graduateStatus"],
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

/**
 * Creates a check in schema.
 *
 * @param reasons a `const readonly` array of strings with at least 1 element.
 */
export function makeCheckInSchema<
  const T extends readonly [string, ...string[]],
>(reasons: T) {
  return z
    .object({
      person: personSchema,
      reasons: z.array(z.enum(reasons)),
      reasonOther: z.string(),
    })
    .refine(
      (data) => {
        const b = !(
          data.reasons.length === 0 && data.reasonOther?.trim().length === 0
        );
        console.log({ b });
        return b;
      },
      {
        message: "You must have at least 1 reason or fill out the Other field",
        path: ["reasons"],
      },
    );
}

export const mlCheckInSchema = makeCheckInSchema(ML_REASONS);
export const alCheckInSchema = makeCheckInSchema(AL_REASONS);
export const dslCheckInSchema = makeCheckInSchema(DSL_REASONS);

export type MlCheckIn = z.infer<typeof mlCheckInSchema>;
export type AlCheckIn = z.infer<typeof alCheckInSchema>;
export type DslCheckIn = z.infer<typeof dslCheckInSchema>;

export const checkInSchmas = {
  mlCheckInSchema,
  alCheckInSchema,
  dslCheckInSchema,
} as const;

export type CheckIn = MlCheckIn | AlCheckIn | DslCheckIn;
