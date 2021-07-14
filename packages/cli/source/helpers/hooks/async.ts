import { useEffect, useState } from "react";

type Status = "Unresolved" | "Settled" | "Errored";

export function useAsync<R, E = Error>(fn: () => Promise<R>) {
  const [status, setStatus] = useState<Status>("Unresolved");
  const [value, setValue] = useState<R | undefined>(undefined);
  const [error, setError] = useState<E | undefined>(undefined);

  useEffect(() => {
    try {
      fn().then((value) => {
        setValue(value);
        setStatus("Settled");
      });
    } catch (error) {
      setError(error);
    }
  }, []);

  return {
    status,
    value,
    error,
  };
}
