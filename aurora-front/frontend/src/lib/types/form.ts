import { z } from "zod";

/* ------------------ ENUMS ------------------ */

export enum TemplateType {
    template1 = 1,
    template2 = 2,
    template3 = 3,
    template4 = 4,
    template5 = 5,
}

export enum SkillLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    FLUENT = "FLUENT",
    EXPERT = "EXPERT",
    MASTER = "MASTER"
}

export enum EducationDegree {
    LOWER_SECONDARY_SCHOOL = "LOWER_SECONDARY_SCHOOL",
    UPPER_SECONDARY_SCHOOL = "UPPER_SECONDARY_SCHOOL",
    VOCATIONAL_SCHOOL = "VOCATIONAL_SCHOOL",
    HIGH_SCHOOL = "HIGH_SCHOOL",
    TECHNICAL_COLLEGE = "TECHNICAL_COLLEGE",
    COLLEGE = "COLLEGE",
    UNIVERSITY = "UNIVERSITY",
    ASSOCIATE_DEGREE = "ASSOCIATE_DEGREE",
    BACHELOR_DEGREE = "BACHELOR_DEGREE",
    MASTER_DEGREE = "MASTER_DEGREE",
    DOCTORAL_DEGREE = "DOCTORAL_DEGREE",
    POSTDOCTORAL = "POSTDOCTORAL",
    PROFESSIONAL_CERTIFICATE = "PROFESSIONAL_CERTIFICATE",
    OTHER = "OTHER"
}

/* ---------- ZOD V4 ENUM VALIDATION ---------- */
/* numeric enum → use union of literals */
export const TemplateTypeEnum = z.union(
    Object.values(TemplateType)
        .filter((v) => typeof v === "number")
        .map((v) => z.literal(v as number)) as [
        z.ZodLiteral<number>,
        ...z.ZodLiteral<number>[]
    ]
);

/* string enums → z.enum([...]) */
export const SkillLevelEnum = z.enum(
    Object.values(SkillLevel) as [string, ...string[]]
);

export const EducationDegreeEnum = z.enum(
    Object.values(EducationDegree) as [string, ...string[]]
);

/* ------------------ HELPERS ------------------ */

const urlSchema = z
    .union([
        z.url().refine(
            (url) => url.startsWith("http://") || url.startsWith("https://"),
            "URL must start with http:// or https://"
        ),
        z.literal("")
    ])
    .optional();


const InstantSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/, "Invalid Instant format")
    .refine(val => !isNaN(Date.parse(val)), "Invalid date value");


/* ------------------ OBJECTS ------------------ */

export const ExperienceSchema = z.object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    description: z.string().nullable(),
    startDate: InstantSchema,
    endDate: InstantSchema.nullable(),
});

export const AchievementSchema = z.object({
    title: z.string().min(1,"Achievement title cannot be blank"),
    description: z.string().min(1,"Achievement title cannot be blank"),
    year: z.number().min(1900).max(new Date().getFullYear()).nullable()
});

export const SkillSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
    level: SkillLevelEnum,
});

export const EducationSchema = z.object({
    institution: z.string().min(1, "Institution name is required"),
    major: z.string().nullable(),
    degree: EducationDegreeEnum,
    fromYear: z.number().min(1900).max(new Date().getFullYear()),
    toYear: z.number().min(1900).max(new Date().getFullYear()),
});

export const PersonalPortfolioSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
});

/* ------------------ ROOT FORM ------------------ */

export const formSchema = z.object({
    template: TemplateTypeEnum,

    title: z.string().min(1, "Title is required"),
    email: z.email("Invalid email"),

    website: urlSchema,
    linkedIn: urlSchema,
    gitHub: urlSchema,

    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),

    profileDescription: z.string().nullable(),
    age: z.number().min(0, "Age cannot be negative").max(150, "Age cannot be greater than 150"),

    education: z.array(EducationSchema),
    experience: z.array(ExperienceSchema),
    achievements: z.array(AchievementSchema),
    skills: z.array(SkillSchema),
    personalPortfolio: z.array(PersonalPortfolioSchema),

    profileImage: z.instanceof(File).nullable(),
});

export type FormValues = z.infer<typeof formSchema>;
