import type { Family } from "../types/types";
import { FamilySchema } from "../types/schemas";

/**
  * Fetch and validate family data from a JSON file.
  * 
  * @param source The path or URL to the JSON file containing the family data.
  * @returns A promise that resolves to a validated Family object.
  * @throws An error if the fetch fails or if the data is invalid.
  */
export async function getFamilyData(source: string): Promise<Family> {

  // Network request to fetch JSON file 
  const response = await fetch(source);

  // Check network response is OK (status in the range 200-299)
  if (!response.ok) throw new Error(`Failed to fetch ${source}: ${response.status}`);

  // Parse the JSON data
  const data = await response.json();

   // Validate data against the FamilySchema and return it or throw an error if invalid
  try {
    return FamilySchema.parse(data);
  } catch (err: any) {
    throw new Error(`Failed to parse ${source}: ${err}`);
  }
}
