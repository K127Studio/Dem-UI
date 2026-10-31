/**
 * Image optimization in the browser, before a file leaves for storage. Ported from Hanuman
 * Beverages. The encoder is imported on demand: a page that never optimizes does not load it.
 */
export interface ImageOptimizationOptions {
  /** Resize and recompress. */
  compressImage?: boolean;
  /** Encoder quality from 0.1 to 1: lower means smaller and rougher. PNG stays lossless. */
  compressionRate?: number;
  /** Convert to WebP, keeping transparency. Works with `compressImage` off too. */
  convertToWebp?: boolean;
  /** Target size ceiling in MB, when compressing. */
  maxSizeMB?: number;
  /** Longest side in pixels; larger pictures are scaled down, never up. */
  maxWidthOrHeight?: number;
}

export const OPTIMIZE_PRESETS = {
  /** Heroes, thumbnails, social cards, article pictures. */
  standard: { maxSizeMB: 2, maxWidthOrHeight: 1920 },
  /** Artwork that needs more resolution. */
  large: { maxSizeMB: 3, maxWidthOrHeight: 2048 },
  /** Small square pictures such as avatars. */
  avatar: { maxSizeMB: 0.5, maxWidthOrHeight: 512 },
};

export interface OptimizedImage {
  file: File;
  originalBytes: number;
  optimizedBytes: number;
}

/** Types the encoder would rasterize or flatten (vector, animation): sent untouched. */
const PASS_THROUGH_TYPES = new Set(["image/svg+xml", "image/gif"]);

const clampRate = (rate: number) => Math.min(1, Math.max(0.1, rate));

/**
 * When nothing is asked for, or optimizing fails, the original comes back, so a caller always
 * gets a usable file. A plain recompression that is not smaller is dropped; a conversion was
 * asked for, so it stands even if it is not smaller.
 */
export async function optimizeImage(file: File, options: ImageOptimizationOptions = {}): Promise<OptimizedImage> {
  const { compressImage = false, compressionRate = 0.8, convertToWebp = false, ...limits } = options;
  const untouched = { file, originalBytes: file.size, optimizedBytes: file.size };
  const toWebp = convertToWebp && file.type !== "image/webp";
  if ((!compressImage && !toWebp) || PASS_THROUGH_TYPES.has(file.type)) return untouched;

  const type = toWebp ? "image/webp" : file.type;
  const name = toWebp ? `${file.name.replace(/\.[^.]+$/, "")}.webp` : file.name;

  try {
    const { default: imageCompression } = await import("browser-image-compression");
    const compressed = await imageCompression(file, {
      ...(compressImage ? { ...OPTIMIZE_PRESETS.standard, ...limits } : limits),
      initialQuality: compressImage ? clampRate(compressionRate) : 1,
      useWebWorker: true,
      fileType: type,
      preserveExif: false,
    });
    if (!toWebp && compressed.size >= file.size) return untouched;
    return {
      file: new File([compressed], name, { type, lastModified: Date.now() }),
      originalBytes: file.size,
      optimizedBytes: compressed.size,
    };
  } catch (error) {
    console.error("Image optimization failed, using the original file:", error);
    return untouched;
  }
}

/** "2.4 MB", "340 KB". */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
