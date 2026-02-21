import type { Family } from "../types/types";
import { useEffect, useState } from "react";
import { getData } from "../api/fetch";

export function useData(path: string) {
  const [data, setData] = useState<Family | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getData(path)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [path]);

  return { data, error };
}
