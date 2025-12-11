import {z} from "zod";

export const RegisterSchema = z.object({
    username: z.string().min(1, "username is required"),
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required")
});

export type RegisterValues = z.infer<typeof RegisterSchema>;