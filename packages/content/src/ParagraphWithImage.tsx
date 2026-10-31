import { useStyles, useUI } from "@dem-ui/foundation";
import { Paragraph, type ParagraphProps } from "@dem-ui/base";

export interface ParagraphWithImageProps extends ParagraphProps {
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right" | "top" | "bottom" | "background";
  imageAspectRatio?: "square" | "video" | "portrait" | "wide" | "auto";
  /** 0 to 1, only for `imagePosition="background"`. */
  overlayOpacity?: number;
  imageClassName?: string;
  containerClassName?: string;
}

export function ParagraphWithImage({
  imageSrc,
  imageAlt = "",
  imagePosition = "left",
  imageAspectRatio = "video",
  overlayOpacity = 0.4,
  imageClassName,
  containerClassName,
  align = "left",
  className,
  ...paragraph
}: ParagraphWithImageProps) {
  const { Image } = useUI();
  const isBackground = imagePosition === "background";
  const s = useStyles("paragraphWithImage", {
    imagePosition,
    imageAspectRatio: isBackground ? undefined : imageAspectRatio,
  });

  return (
    <div className={s("root", containerClassName)}>
      <div className={s("media", imageClassName)}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={s("image")}
            sizes={isBackground ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
            priority={isBackground}
          />
        )}
        {isBackground && <div className={s("overlay")} style={{ opacity: overlayOpacity }} />}
      </div>
      <div className={s("text")}>
        <Paragraph align={isBackground ? "center" : align} className={className} {...paragraph} />
      </div>
    </div>
  );
}
