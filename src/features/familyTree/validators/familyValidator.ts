import { z } from "zod";

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

    // Check for duplicates
    .refine(
      (members) => {

        const ids = new Set<string>();
        const duplicates = new Set<string>();

        for (const person of members) {
          if (ids.has(person.id)) {
            duplicates.add(person.id);
          } else {
            ids.add(person.id);
          }
        }

        if (duplicates.size > 0) {
          console.error(`Duplicate ID found: ${[...duplicates].join(", ")}`);
        }

        return duplicates.size === 0;
      },
      { message: "Duplicate ID found" }
    )

    // Check for missing parent
    .refine(
      (members) => {

        const ids = new Set(members.map(member => member.id));
        const parents = members.map(member => member.parent)

        const missingParents = parents.filter(
          (parent): parent is string => parent !== null && !ids.has(parent)
        );

        if (missingParents.length > 0) {
          console.error(`Parent ID not found: ${[...new Set(missingParents)].join(", ")}`);
        }

        return missingParents.length === 0;
      },
      { message: "Parent ID not found" }
    )

    // Check for exactly one root
    .refine(
      (members) => {
      
        const roots = members.filter(member => member.parent === null);

        if (roots.length !== 1) {
          const errorMessage =
            roots.length === 0
              ? "No root found (a parent = null is required)"
              : `Multiple root found: ${roots.map(r => r.id).join(", ")}`;

          console.error(errorMessage);
        }

        return roots.length === 1;
      },
      { message: "No root or multiple roots found" }
    )
});

export type Person = z.infer<typeof PersonSchema>;
export type Family = z.infer<typeof FamilySchema>;
