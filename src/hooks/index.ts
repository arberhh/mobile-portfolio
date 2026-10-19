import { useEffect, useState } from "react";
import useHydrated from "./use-hydrated";
import useSystemThemeSync from "./use-system-theme-sync";

// `initialValue` is the build-time snapshot when one exists. With it, the
// screen renders content immediately (and in static HTML), the fetch only
// refreshes it, and a failed refresh keeps the snapshot instead of an error.
function useAsync<T>(fetcher: () => Promise<T>, initialValue: T, hasInitialData = false) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(!hasInitialData);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function run() {
      try {
        setData(await fetcher());
      } catch (err: any) {
        console.error(err);
        if (!hasInitialData) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [fetcher, hasInitialData]);

  return { data, loading, error };
}

export { useAsync, useHydrated, useSystemThemeSync };
