import { z } from "zod";

export enum TemplateType{
    template1 = 1,
    template2 = 2,
    template3 = 3,
    template4 = 4,
    template5 = 5
}
export enum SkillLevel{
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    FLUENT = "FLUENT",
    EXPERT = "EXPERT",
    MASTER = "MASTER"
}

export enum EducationDegree{
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

export const TemplateTypeEnum = z.enum(TemplateType);
export const SkillLevelEnum = z.enum(SkillLevel);
export const EducationDegreeEnum = z.enum(EducationDegree);
const InstantSchema = z
    .string()
    .refine(
        (val) => !isNaN(Date.parse(val)),
        "Invalid Instant format"
    );

export const ExperienceSchema = z.object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    description: z.string().nullable(),
    startDate: InstantSchema,
    endDate: InstantSchema.nullable(),
});

export const AchievementSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    year: z.number().nullable()
});

export const SkillSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
    level: SkillLevelEnum
});
export const EducationSchema = z.object({
    institution: z.string(),
    major: z.string().nullable(),
    degree: EducationDegreeEnum,
    fromYear: z.number(),
    toYear: z.number().nullable(),
});

export const formSchema = z.object({
    template: TemplateTypeEnum,

    title: z.string().min(1, "Title is required"),
    email: z.email("Invalid email"),
    website: z.url("Invalid URL").optional().or(z.literal("")),
    linkedIn: z.url("Invalid URL").optional().or(z.literal("")),
    gitHub: z.url("Invalid URL").optional().or(z.literal("")),

    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),

    description: z.string().nullable(),
    age: z.number().min(0, "Age cannot be negative"),

    experience: z.array(ExperienceSchema),
    achievements: z.array(AchievementSchema),
    skills: z.array(SkillSchema),
    education: z.array(EducationSchema),

    photo: z.instanceof(File).nullable(),
});

export type FormValues = z.infer<typeof formSchema>;