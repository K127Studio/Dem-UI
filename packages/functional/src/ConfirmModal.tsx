import type { ReactNode } from "react";
import type { IconName } from "@dem-ui/foundation";
import { Button, type ButtonVariant } from "@dem-ui/base";
import { Modal } from "./Modal";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

export type ConfirmTone = "danger" | "warning" | "success" | "info";

const TONES: Record<ConfirmTone, { icon: IconName; button: ButtonVariant }> = {
  danger: { icon: "trash", button: "danger" },
  warning: { icon: "alert", button: "accent" },
  success: { icon: "checkCircle", button: "success" },
  info: { icon: "info", button: "primary" },
};

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tone?: ConfirmTone;
  title: ReactNode;
  question: ReactNode;
  detail?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  isLoading?: boolean;
  error?: ReactNode;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  classNames?: Partial<Record<"content" | "iconBox" | "icon" | "question" | "detail" | "error", string>>;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  tone = "info",
  title,
  question,
  detail,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  error,
  icon,
  size = "md",
  classNames,
}: ConfirmModalProps) {
  const { labels } = useUI();
  const s = useStyles("confirmModal", { tone }, classNames);
  const { icon: toneIcon, button } = TONES[tone];

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} size={size} mobile="card">
      <Modal.Header hideClose={isLoading}>{title}</Modal.Header>
      <Modal.Body>
        <div className={s("content")}>
          <div className={s("iconBox")}>{icon ?? <Icon name={toneIcon} className={s("icon")} />}</div>
          <div className="min-w-0 flex-1">
            <p className={s("question")}>{question}</p>
            {detail && <p className={s("detail")}>{detail}</p>}
            {error && (
              <p role="alert" className={s("error")}>
                {error}
              </p>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {cancelLabel ?? labels.cancel}
        </Button>
        <Button variant={button} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel ?? labels.confirm}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
