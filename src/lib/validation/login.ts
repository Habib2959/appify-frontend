import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Enter a valid email"),
	password: z.string().min(1, "Password is required"),
	remember: z.boolean(),
});

export type LoginValues = z.infer<typeof loginSchema>;
