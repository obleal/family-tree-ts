import { z } from "zod";
import { checkDuplicates, checkMissingParents, checkSingleRoot } from "./refinements";

export const PersonSchema = z.object({
    id: z.string().describe("hidden"),
    first_name: z.string(),
    middle_name: z.string().optional(),
    last_name: z.string(),
    alias: z.string().optional(),
    parent: z.string().nullable().describe("hidden"),
});

export const FamilySchema = z.object({
    name: z.string(),
    members: z.array(PersonSchema)
        .refine(checkDuplicates, { message: "Duplicate ID found" })
        .refine(checkMissingParents, { message: "Parent ID not found" })
        .refine(checkSingleRoot, { message: "No root or multiple roots found" }),
});

