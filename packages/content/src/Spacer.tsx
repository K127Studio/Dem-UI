import { useStyles } from "@dem-ui/foundation";

export interface SpacerProps {
  /** A size from the scale, or any CSS height: "10vh". */
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | (string & {});
  /** `spacer` is empty space, `divider` draws a line in the middle of it. */
  type?: "spacer" | "divider";
  /** Line colour classes. Defaults to the theme's border colour. */
  lineColorClassName?: string;
  /** Any CSS width: "100%", "50%", "200px". */
  lineWidth?: string;
  lineHeight?: "1" | "2" | "4" | "8" | "16" | "24" | "32";
  /** 0 to 1. */
  opacity?: number;
  className?: string;
  classNames?: Partial<Record<"root" | "line", string>>;
}

const SCALE = ["xs", "sm", "md", "lg", "xl", "2xl"];

export function Spacer({ height = "md", type = "spacer", lineColorClassName, lineWidth = "100%", lineHeight = "1", opacity = 1, className, classNames }: SpacerProps) {
  const isScale = SCALE.includes(height);
  const s = useStyles("spacer", { height: isScale ? height : undefined, thickness: lineHeight }, classNames);
  return (
    <div className={s("root", className)} style={isScale ? undefined : { height }} aria-hidden="true">
      {type === "divider" && <div className={s("line", lineColorClassName)} style={{ width: lineWidth, opacity }} />}
    </div>
  );
}
