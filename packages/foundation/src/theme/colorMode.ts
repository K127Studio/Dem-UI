import { useCallback, useEffect, useState } from "react";
import type { ThemeMode } from "./UIProvider";

/** What every dark mode toggle receives, so they can replace each other. */
export interface ThemeToggleProps {
  isDark: boolean;
  onChange: (isDark: boolean) => void;
  /** Accessible name. Defaults to a label for the mode it switches to. */
  label?: string;
  className?: string;
}

export interface UseColorModeOptions {
  /** localStorage key. Pass `null` to keep the choice in memory only. */
  storageKey?: string | null;
  /** Used until a saved choice is read, and when there is none. */
  defaultMode?: ThemeMode;
  /** Follows the operating system when nothing is saved. */
  followSystem?: boolean;
}

const isMode = (value: unknown): value is ThemeMode => value === "light" || value === "dark";

/**
 * Remembers the colour mode and keeps other tabs in sync. Pass `mode` to `UIProvider` and
 * `isDark` / `setIsDark` to a toggle. The first render always uses `defaultMode`, so server
 * and client markup match; the saved choice applies right after.
 */
export function useColorMode({ storageKey = "dem-ui-mode", defaultMode = "light", followSystem = false }: UseColorModeOptions = {}) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = storageKey ? localStorage.getItem(storageKey) : null;
    } catch {
      // Storage can be blocked: the choice then lasts for this page only.
    }
    if (isMode(saved)) setModeState(saved);
    else if (followSystem) setModeState(matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, [storageKey, followSystem]);

  useEffect(() => {
    if (!storageKey) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey && isMode(event.newValue)) setModeState(event.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      try {
        if (storageKey) localStorage.setItem(storageKey, next);
      } catch {
        // See above.
      }
    },
    [storageKey],
  );

  const setIsDark = useCallback((isDark: boolean) => setMode(isDark ? "dark" : "light"), [setMode]);

  return { mode, isDark: mode === "dark", setMode, setIsDark };
}
