import type { AudioHTMLAttributes, HTMLAttributes, IframeHTMLAttributes, ReactNode, VideoHTMLAttributes } from "react";
import { useDefaults, useStyles, useUI } from "@dem-ui/foundation";

export type AspectRatio = "auto" | "square" | "video" | "portrait" | "wide";
export type MediaFit = "cover" | "contain" | "fill" | "none";
export type MediaRoundness = "none" | "control" | "card" | "full";

export interface ImageProps {
  src: string;
  /** Required on purpose: pass `alt=""` when the image is only decoration. */
  alt: string;
  width?: number;
  height?: number;
  /** Fills a positioned parent instead of `width` and `height`. */
  fill?: boolean;
  sizes?: string;
  /** Loads at once, for what is visible on arrival. Otherwise it loads lazily. */
  priority?: boolean;
  aspect?: AspectRatio;
  fit?: MediaFit;
  roundness?: MediaRoundness;
  className?: string;
}

/** Renders through the provider's `Image`, so `next/image` applies where it is configured. */
export function Image(rawProps: ImageProps) {
  const { aspect = "auto", fit = "cover", roundness = "none", className, ...props } = useDefaults("image", rawProps);
  const { Image: ImageComponent } = useUI();
  const s = useStyles("image", { aspect, fit, roundness });
  return <ImageComponent className={s("root", className)} {...props} />;
}

export interface FigureProps extends HTMLAttributes<HTMLElement> {
  /** Shown under the content. */
  caption?: ReactNode;
}

/** Self-contained content with its caption: a picture, a chart, a code sample. */
export function Figure(rawProps: FigureProps) {
  const { caption, children, className, ...props } = useDefaults("figure", rawProps);
  const s = useStyles("figure");
  return (
    <figure className={s("root", className)} {...props}>
      {children}
      {caption && <figcaption className={s("caption")}>{caption}</figcaption>}
    </figure>
  );
}

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  aspect?: AspectRatio;
  fit?: MediaFit;
  roundness?: MediaRoundness;
  /** Describes the video for screen readers. */
  "aria-label"?: string;
}

export function Video(rawProps: VideoProps) {
  const { aspect = "video", fit = "cover", roundness = "none", controls = true, playsInline = true, className, ...props } = useDefaults("video", rawProps);
  const s = useStyles("image", { aspect, fit, roundness });
  return <video controls={controls} playsInline={playsInline} className={s("root", className)} {...props} />;
}

export function Audio(rawProps: AudioHTMLAttributes<HTMLAudioElement>) {
  const { controls = true, className, ...props } = useDefaults("audio", rawProps);
  const s = useStyles("audio");
  return <audio controls={controls} className={s("root", className)} {...props} />;
}

export interface EmbedProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  /** Required on purpose: it is how a screen reader names the frame. */
  title: string;
  aspect?: AspectRatio;
  roundness?: MediaRoundness;
}

/** An `iframe`: a map, a player. Loads lazily. */
export function Embed(rawProps: EmbedProps) {
  const { aspect = "video", roundness = "none", loading = "lazy", className, ...props } = useDefaults("embed", rawProps);
  const s = useStyles("image", { aspect, roundness });
  return <iframe loading={loading} className={s("root", "border-0", className)} {...props} />;
}
