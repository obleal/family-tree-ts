import type { Family } from "../validators/familyValidator";
import { FamilySchema } from "../validators/familyValidator";

/**
 * Fetch and validate a family JSON file.
 * @param fileName Path or URL to the JSON file (e.g., "/family.json")
 */
export async function fetchFamily(fileName: string): Promise<Family> {
  const response = await fetch(fileName);
  if (!response.ok) throw new Error(`Failed to fetch ${fileName}: ${response.status}`);
  const data = await response.json();
  try {
    return FamilySchema.parse(data);
  } catch (err: any) {
    throw new Error(`Failed to parse ${fileName}: ${err}`);
  }
}
