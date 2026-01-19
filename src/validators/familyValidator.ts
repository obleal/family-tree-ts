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
        const ids = new Set<string>();
        const duplicatedIds = new Set<string>();
        for (const m of members) if (ids.has(m.id)) duplicatedIds.add(m.id); else ids.add(m.id);
        if (duplicatedIds.size > 0) console.error(`Duplicate ID: ${[...duplicatedIds].join(", ")}`);
        return duplicatedIds.size === 0;
      },
      { message: "Duplicate ID found" }
    )
    .refine(
      (members) => {
        const ids = new Set(members.map(m => m.id));
        const missingParentsIds = members.map(m => m.parent).filter((p): p is string => p !== null && !ids.has(p));
        if (missingParentsIds.length > 0) console.error(`Parent ID not found: ${[...new Set(missingParentsIds)].join(", ")}`);
        return missingParentsIds.length === 0;
      },
      { message: "All parent references must exist in member IDs." }
    )
});

export type FamilyMember = z.infer<typeof FamilyMemberSchema>;
export type Family = z.infer<typeof FamilySchema>;
