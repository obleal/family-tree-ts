import { useEffect, useState } from "react";
import type { Family } from "../types/types";
import { getFamilyData } from "../api/getFamilyData";

export function useFamilyTree(path: string) {
  const [family, setFamily] = useState<Family | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFamilyData(path)
      .then(setFamily)
      .catch((err) => setError(err.message));
  }, [path]);

  return { family, error };
}
