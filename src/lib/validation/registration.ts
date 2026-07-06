import { z } from "zod";

export const registrationSchema = z
	.object({
		firstName: z.string().trim().min(1, "First name is required"),
		lastName: z.string().trim().min(1, "Last name is required"),
		email: z.email("Enter a valid email"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		repeatPassword: z.string().min(1, "Please repeat your password"),
		agree: z.boolean().refine((v) => v, "Please accept the terms & conditions"),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: "Passwords do not match",
		path: ["repeatPassword"],
	});

export type RegistrationValues = z.infer<typeof registrationSchema>;
