import type { Family } from "../validators/familyValidator";
import { FamilySchema } from "../validators/familyValidator";

export async function fetchFamily(): Promise<Family> {
  const response = await fetch("/family.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch family.json: ${response.status}`);
  }

  const data = await response.json();

  try {
    return FamilySchema.parse(data);
  } catch (err: any) {
    console.error("Validation failed:", JSON.stringify(err.errors, null, 2));
    throw new Error("Invalid family data");
  }
}
