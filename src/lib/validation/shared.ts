import { z } from "zod";

// First error message per field, keyed by field name.
export function getFieldErrors(error: z.ZodError): Record<string, string> {
	const { fieldErrors } = z.flattenError(error);
	const result: Record<string, string> = {};
	for (const [field, messages] of Object.entries(fieldErrors) as [
		string,
		string[] | undefined,
	][]) {
		if (messages && messages.length > 0) result[field] = messages[0];
	}
	return result;
}
