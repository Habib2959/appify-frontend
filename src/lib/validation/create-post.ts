import { z } from "zod";

export const createPostSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, "Write something to post")
		.max(500, "Max 500 characters"),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;
