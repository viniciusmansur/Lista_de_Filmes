import { useCallback, useEffect, useState } from "react";

/**
 * Executa `fetcher(signal)` sempre que `deps` mudar.
 * Respostas de requisições antigas são descartadas via AbortController.
 */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
    // `deps` é repassado pelo chamador; `reloadKey` dispara o refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { ...state, refetch };
}
