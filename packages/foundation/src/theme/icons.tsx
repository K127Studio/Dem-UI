import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * The icons the components ask for, by meaning. A project can add names of its own:
 *
 *   declare module "@dem-ui/core" {
 *     interface IconRegistry { bottle: true }
 *   }
 */
export interface IconRegistry {
  alert: true;
  arrowDown: true;
  arrowLeft: true;
  arrowRight: true;
  arrowUp: true;
  check: true;
  checkCircle: true;
  chevronDown: true;
  chevronLeft: true;
  chevronRight: true;
  close: true;
  columns: true;
  fileText: true;
  filter: true;
  globe: true;
  image: true;
  imageAdd: true;
  info: true;
  layout: true;
  menu: true;
  palette: true;
  placeholder: true;
  plus: true;
  quote: true;
  save: true;
  search: true;
  sort: true;
  spinner: true;
  trash: true;
  type: true;
}

export type IconName = keyof IconRegistry;
export type IconSet = Record<IconName, IconComponent>;
