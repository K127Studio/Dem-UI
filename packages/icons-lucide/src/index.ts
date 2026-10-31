import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Construction,
  FileText,
  Globe,
  Palette,
  SlidersHorizontal,
  Image,
  ImagePlus,
  Info,
  LayoutGrid,
  Loader2,
  Menu,
  Plus,
  Quote,
  Save,
  Search,
  Trash2,
  TriangleAlert,
  Type,
  X,
  type LucideProps,
} from "lucide-react";
import { createElement, type ComponentType } from "react";
import type { IconComponent, IconSet } from "@dem-ui/foundation";

const SOURCE: Record<keyof IconSet, ComponentType<LucideProps>> = {
  alert: TriangleAlert,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  check: Check,
  checkCircle: CheckCircle2,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  columns: Columns2,
  fileText: FileText,
  filter: SlidersHorizontal,
  globe: Globe,
  palette: Palette,
  image: Image,
  imageAdd: ImagePlus,
  info: Info,
  layout: LayoutGrid,
  menu: Menu,
  placeholder: Construction,
  plus: Plus,
  quote: Quote,
  save: Save,
  search: Search,
  sort: ArrowUpDown,
  spinner: Loader2,
  trash: Trash2,
  type: Type,
};

/**
 * The Lucide icons with a stroke of the theme's own: heavy and square for one, hairline for
 * another. The same drawings read very differently.
 */
export function createLucideIcons(style: LucideProps = {}): IconSet {
  const entries = Object.entries(SOURCE).map(([name, Component]) => {
    const Styled: IconComponent = (props) => createElement(Component, { ...style, ...(props as LucideProps) });
    return [name, Styled];
  });
  return Object.fromEntries(entries) as IconSet;
}

export const lucideIcons = createLucideIcons();
