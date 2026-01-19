import { z } from "zod";

export const FamilyMemberSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  parent: z.string().nullable(),
  middle_name: z.string().optional(),
  alias: z.string().optional()
});

export const FamilySchema = z.object({
  name: z.string(),
  members: z.array(FamilyMemberSchema)
    .refine(
      (members) => {
        const ids = members.map((m) => m.id);
        return ids.length === new Set(ids).size;
      },
      { message: "Member IDs must be unique." }
    )
    .refine(
      (members) => {
        const ids = new Set(members.map((m) => m.id));
        const invalid = members.filter(m => m.parent !== null && !ids.has(m.parent));
        if (invalid.length > 0) console.log("Invalid parents:", invalid);
        return invalid.length === 0;
      },
      { message: "All parent references must exist in member IDs." }
    ),
});

export type FamilyMember = z.infer<typeof FamilyMemberSchema>;
export type Family = z.infer<typeof FamilySchema>;
