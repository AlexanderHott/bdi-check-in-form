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

export const YEARS = Array(5)
  .fill(0)
  .map((_, i) => (new Date().getFullYear() + i).toString());

export const newPersonSchema = z
  .object({
    cardId: z.string().length(15),
    email: z.string().email(),
    name: z.string(),
    graduateStatus: z.enum(GRADUATE_STATUS),
    graduateStatusOther: z.string().optional(),
    graduatingYear: z.string().optional(),
    graduateResearchStatus: z.string().optional(),
    majors: z.array(z.enum(MAJORS)),
    majorOther: z.string().optional(),
    ethnicities: z.array(z.enum(ETHNICITIES)),
    ethnicityOther: z.string().optional(),
    gender: z.enum(GENDERS),
    genderOther: z.string().optional(),
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
export type NewPerson = z.infer<typeof newPersonSchema>;

export const personSchema = z
  .object({
    cardId: z.string().length(15),
    email: z.string().email(),
    name: z.string(),
    graduateStatus: z.enum(GRADUATE_STATUS).or(z.string()),
    graduatingYear: z.string().optional(),
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
  "Electronics Cabinet",
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
  return z.object({
    person: personSchema,
    reasons: z.array(z.enum(reasons)),
    reasonOther: z.string(),
  });
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
