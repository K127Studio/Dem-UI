import type { ReactNode } from "react";
import { useStyles, useUI } from "@dem-ui/foundation";

type SimpleHeroSlots = "root" | "media" | "image" | "overlay" | "container" | "content" | "title" | "subtitle" | "actions";

export interface SimpleHeroProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  align?: "left" | "center" | "right";
  vAlign?: "top" | "center" | "bottom";
  titleClassName?: string;
  subtitleClassName?: string;
  /** Replaces the black overlay; `overlayOpacity` then no longer applies. */
  overlayColorClassName?: string;
  overlayOpacity?: number;
  /** Buttons and anything else under the text. */
  children?: ReactNode;
  className?: string;
  classNames?: Partial<Record<SimpleHeroSlots, string>>;
}

export function SimpleHero({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  align = "center",
  vAlign = "center",
  titleClassName,
  subtitleClassName,
  overlayColorClassName,
  overlayOpacity = 0.4,
  children,
  className,
  classNames,
}: SimpleHeroProps) {
  const { Image } = useUI();
  const s = useStyles<SimpleHeroSlots>("simpleHero", { align, vAlign }, classNames);
  return (
    <section className={s("root", className)}>
      <div className={s("media")}>
        {imageSrc && <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className={s("image")} />}
        <div
          className={s("overlay", overlayColorClassName)}
          style={overlayColorClassName ? undefined : { opacity: overlayOpacity }}
        />
      </div>
      <div className={s("container")}>
        <div className={s("content")}>
          {title && <h1 className={s("title", titleClassName)}>{title}</h1>}
          {subtitle && <p className={s("subtitle", subtitleClassName)}>{subtitle}</p>}
          {children && <div className={s("actions")}>{children}</div>}
        </div>
      </div>
    </section>
  );
}
