import { z } from "zod";
import { PersonSchema, FamilySchema } from "./schemas";

export type Person = z.infer<typeof PersonSchema>;
export type Family = z.infer<typeof FamilySchema>;
