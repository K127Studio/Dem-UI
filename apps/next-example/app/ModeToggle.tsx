"use client";

import { Button, useThemeMode } from "@dem-ui/core";

// Reads and changes the mode the provider owns; the choice is saved in a cookie for the next visit.
export function ModeToggle() {
  const { isDark, setIsDark } = useThemeMode();
  return (
    <Button variant="secondary" onClick={() => setIsDark(!isDark)} data-testid="mode-toggle">
      {isDark ? "Light mode" : "Dark mode"}
    </Button>
  );
}
