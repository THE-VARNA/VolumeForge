import { z } from "zod";

// IDL upload schema
// parse_idl accepts filePath OR idl inline JSON — not both
export const idlUploadSchema = z.object({
  idl: z.unknown(), // Anchor IDL JSON object
  displayName: z.string().min(1, "Display name required"),
  description: z.string().optional(),
  programAddress: z.string().optional(), // extracted from IDL address field automatically
  selectedInstructions: z.array(z.string()).optional(),
});

export type IdlUploadInput = z.infer<typeof idlUploadSchema>;
