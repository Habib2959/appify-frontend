import { z } from "zod";

export const commentSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, "Write something first")
		.max(500, "Max 500 characters"),
});

export type CommentValues = z.infer<typeof commentSchema>;
