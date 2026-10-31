import type { ComponentType } from "react";
import type { ThemeToggleProps } from "@dem-ui/foundation";
import { SeventiesToggle } from "@dem-ui/toggle-seventies";
import { PushButtonToggle, SkeuomorphicToggle } from "@dem-ui/toggle-skeuomorphic";

export * from "@dem-ui/toggle-seventies";
export * from "@dem-ui/toggle-skeuomorphic";

/** Every toggle, by name. Importing this pulls all of them in: prefer a single package in an app. */
export const toggles = {
  seventies: SeventiesToggle,
  skeuomorphic: SkeuomorphicToggle,
  push: PushButtonToggle,
} satisfies Record<string, ComponentType<ThemeToggleProps>>;

export type ToggleName = keyof typeof toggles;
