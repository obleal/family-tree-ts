import type { Family } from "../validators/familyValidator";
import { FamilySchema } from "../validators/familyValidator";

/**
  * Fetch and validate family data from a JSON file.
  * 
  * @param fileName The path or URL to the JSON file containing the family data.
  * @returns A promise that resolves to a validated Family object.
  * @throws An error if the fetch fails or if the data is invalid.
  */
export async function fetchFamily(fileName: string): Promise<Family> {

  // Network request to fetch JSON file 
  const response = await fetch(fileName);

  // Check network response is OK (status in the range 200-299)
  if (!response.ok) throw new Error(`Failed to fetch ${fileName}: ${response.status}`);

  // Parse the JSON data
  const data = await response.json();

   // Validate data against the FamilySchema and return it or throw an error if invalid
  try {
    return FamilySchema.parse(data);
  } catch (err: any) {
    throw new Error(`Failed to parse ${fileName}: ${err}`);
  }
}
