import type { ImgHTMLAttributes } from "react";
import { FLAG_SOURCES } from "./flags";

export { FLAG_SOURCES };
export type FlagCode = keyof typeof FLAG_SOURCES;

export const FLAG_NAMES: Record<FlagCode, string> = {
  "gb": "United Kingdom",
  "us": "United States",
  "it": "Italy",
  "fr": "France",
  "de": "Germany",
  "es": "Spain",
  "pt": "Portugal",
  "nl": "Netherlands",
  "kh": "Cambodia",
  "th": "Thailand",
  "vn": "Vietnam",
  "la": "Laos",
  "mm": "Myanmar",
  "cn": "China",
  "jp": "Japan",
  "kr": "South Korea",
  "in": "India",
  "id": "Indonesia",
  "ru": "Russia",
  "br": "Brazil",
  "sa": "Saudi Arabia"
};

export interface FlagProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  code: FlagCode;
  /** Side in pixels. */
  size?: number;
}

/** One round flag. Decorative unless given an `alt`, since a label usually sits beside it. */
export function Flag({ code, size = 20, alt = "", style, ...props }: FlagProps) {
  return <img src={FLAG_SOURCES[code]} alt={alt} width={size} height={size} draggable={false} style={{ width: size, height: size, flexShrink: 0, ...style }} {...props} />;
}

export default Flag;
