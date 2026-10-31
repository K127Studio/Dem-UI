import type { ReactNode } from "react";
import { useStyles, useUI } from "@dem-ui/foundation";

type GridHeroSlots = "root" | "media" | "image" | "content" | "panel";

export function GridHeroPanel({ children, className }: { children?: ReactNode; className?: string }) {
  const s = useStyles<GridHeroSlots>("gridHero");
  return <div className={s("panel", className)}>{children}</div>;
}

export interface GridHeroProps {
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  /** One or more stacked `GridHeroPanel`. */
  children?: ReactNode;
  className?: string;
  classNames?: Partial<Record<GridHeroSlots, string>>;
}

export function GridHero({ imageSrc, imageAlt = "", imagePosition = "left", children, className, classNames }: GridHeroProps) {
  const { Image } = useUI();
  const hasImage = Boolean(imageSrc);
  const s = useStyles<GridHeroSlots>("gridHero", { imagePosition, hasImage }, classNames);
  return (
    <section className={s("root", className)}>
      {hasImage && (
        <div className={s("media")}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={s("image")}
          />
        </div>
      )}
      <div className={s("content")}>
        {children}
      </div>
    </section>
  );
}

GridHero.Panel = GridHeroPanel;
