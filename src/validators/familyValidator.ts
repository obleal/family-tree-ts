import { z } from "zod";

export const FamilyMemberSchema = z.object({
  id: z.string().describe("hidden"),
  first_name: z.string(),
  middle_name: z.string().optional(),
  last_name: z.string(),
  alias: z.string().optional(),
  parent: z.string().nullable().describe("hidden"),
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
      { message: "Duplicate family member ID found" }
    )
    .refine(
      (members) => {
        const ids = new Set(members.map(m => m.id));
        const missingParentsIds = members
          .map(m => m.parent)
          .filter((p): p is string => p !== null && !ids.has(p));
        if (missingParentsIds.length > 0) console.error(`Parent ID not found: ${[...new Set(missingParentsIds)].join(", ")}`);
        return missingParentsIds.length === 0;
      },
      { message: "Parent ID not found in member IDs" }
    )
    .refine(
      (members) => {
        const roots = members.filter((m) => m.parent === null);
        if (roots.length !== 1) {
          console.error(roots.length === 0
              ? "No root member found (parent = null required)"
              : `Multiple root members found: ${roots.map((r) => r.id).join(", ")}`
          );
        }
        return roots.length === 1;
      },
      { message: "There must be exactly one root member with parent = null" }
    )
});

export type FamilyMember = z.infer<typeof FamilyMemberSchema>;
export type Family = z.infer<typeof FamilySchema>;
