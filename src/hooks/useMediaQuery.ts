import { useEffect, useState } from "react";

/**
 * Subscribes to a media query. Used to decide whether the live demo iframe
 * mounts at all — a CSS `display: none` would still fetch and boot 133 KB of
 * IDE on a phone that can never render it legibly.
 */
export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
