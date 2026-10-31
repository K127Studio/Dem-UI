import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Label } from "@dem-ui/base";
import { formatBytes, optimizeImage, type ImageOptimizationOptions, type OptimizedImage } from "./optimizeImage";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

type DropzoneSlots =
  | "root"
  | "zone"
  | "zoneActive"
  | "zoneDisabled"
  | "icon"
  | "prompt"
  | "hint"
  | "preview"
  | "remove"
  | "overlay"
  | "spinner"
  | "saved"
  | "error";

export interface ImageDropzoneProps extends ImageOptimizationOptions {
  /** URL of the current image. */
  value?: string | null;
  /** Called with the new URL, or `null` when the image is removed. */
  onChange?: (value: string | null) => void;
  /**
   * Stores the file and resolves to its URL. The package knows nothing about the storage: R2,
   * S3 or anything else stays in the project. Without it the raw file goes to `onFileSelect`.
   */
  onUpload?: (file: File) => Promise<string>;
  /** Receives the file already optimized, when optimization is on. */
  onFileSelect?: (file: File) => void;
  /** Sizes before and after, to report them. */
  onOptimized?: (result: OptimizedImage) => void;
  label?: ReactNode;
  prompt?: ReactNode;
  hint?: ReactNode;
  accept?: string;
  disabled?: boolean;
  /** Puts the file input in a native form. */
  name?: string;
  className?: string;
  classNames?: Partial<Record<DropzoneSlots, string>>;
}

export function ImageDropzone({
  value,
  onChange,
  onUpload,
  onFileSelect,
  onOptimized,
  compressImage = false,
  compressionRate = 0.8,
  convertToWebp = false,
  maxSizeMB,
  maxWidthOrHeight,
  label,
  prompt,
  hint,
  accept = "image/*",
  disabled = false,
  name,
  className,
  classNames,
}: ImageDropzoneProps) {
  const { labels, Image } = useUI();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saved, setSaved] = useState<string>();
  const [error, setError] = useState<string>();
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const s = useStyles<DropzoneSlots>("imageDropzone", {}, classNames);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFile = async (picked: File | undefined) => {
    if (!picked || disabled) return;
    setError(undefined);
    setSaved(undefined);
    setIsUploading(true);
    const result = await optimizeImage(picked, {
      compressImage,
      compressionRate,
      convertToWebp,
      ...(maxSizeMB !== undefined ? { maxSizeMB } : {}),
      ...(maxWidthOrHeight !== undefined ? { maxWidthOrHeight } : {}),
    });
    const file = result.file;
    // After optimizing: a picture too large as chosen may well fit once compressed.
    if (maxSizeMB !== undefined && !compressImage && file.size > maxSizeMB * 1024 * 1024) {
      setError(labels.fileTooLarge);
      setIsUploading(false);
      return;
    }
    if (file !== picked) {
      setSaved(`${formatBytes(result.originalBytes)} → ${formatBytes(result.optimizedBytes)}`);
      onOptimized?.(result);
      // A native form posts the input's own file: it has to be the optimized one.
      if (name && inputRef.current) {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        inputRef.current.files = transfer.files;
      }
    }
    setLocalPreview(URL.createObjectURL(file));
    onFileSelect?.(file);
    if (!onUpload) {
      setIsUploading(false);
      return;
    }
    try {
      onChange?.(await onUpload(file));
      setLocalPreview(null);
    } catch (cause) {
      setLocalPreview(null);
      setError(cause instanceof Error ? cause.message : labels.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  };

  const remove = () => {
    setLocalPreview(null);
    setError(undefined);
    setSaved(undefined);
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null);
  };

  const preview = localPreview ?? value;

  return (
    <div className={s("root", className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void handleFile(e.dataTransfer.files[0]);
        }}
        className={s("zone", isDragging && s("zoneActive"), disabled && s("zoneDisabled"))}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        {preview ? (
          <>
            <Image src={preview} alt="" fill className={s("preview")} />
            <button
              type="button"
              aria-label={labels.removeImage}
              onClick={(e) => {
                e.stopPropagation();
                remove();
              }}
              className={s("remove")}
            >
              <Icon name="close" className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <Icon name="imageAdd" className={s("icon")} aria-hidden="true" />
            <span className={s("prompt")}>{prompt ?? labels.dropImage}</span>
            {hint && <span className={s("hint")}>{hint}</span>}
          </>
        )}
        {isUploading && (
          <div className={s("overlay")}>
            <Icon name="spinner" className={s("spinner")} aria-hidden="true" />
          </div>
        )}
      </div>
      {saved && !error && <p className={s("saved")}>{saved}</p>}
      {error && (
        <p role="alert" className={s("error")}>
          {error}
        </p>
      )}
    </div>
  );
}
