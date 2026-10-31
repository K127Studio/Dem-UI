import { useState, type ReactNode } from "react";
import { Button, type ButtonProps } from "@dem-ui/base";
import { Icon, useUI } from "@dem-ui/foundation";
import { ConfirmModal } from "./ConfirmModal";

export interface DeleteButtonProps {
  /** The deletion itself. A rejection is shown in the dialog, which stays open. */
  onDelete: () => Promise<void> | void;
  /** Runs after a successful deletion, for example `router.refresh`. */
  onDeleted?: () => void;
  title?: ReactNode;
  question: ReactNode;
  detail?: ReactNode;
  confirmLabel?: ReactNode;
  /** Button text. Without it the button shows only the icon. */
  children?: ReactNode;
  /** Replaces the default button. */
  renderTrigger?: (open: () => void) => ReactNode;
  buttonProps?: Omit<ButtonProps, "onClick">;
}

export function DeleteButton({
  onDelete,
  onDeleted,
  title,
  question,
  detail,
  confirmLabel,
  children,
  renderTrigger,
  buttonProps,
}: DeleteButtonProps) {
  const { labels } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>();

  const open = () => {
    setError(undefined);
    setIsOpen(true);
  };

  const confirm = async () => {
    setIsDeleting(true);
    setError(undefined);
    try {
      await onDelete();
      setIsOpen(false);
      onDeleted?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger(open)
      ) : (
        <Button
          variant="ghost"
          size={children ? "md" : "icon"}
          icon={<Icon name="trash" className="h-4 w-4" aria-hidden="true" />}
          aria-label={children ? undefined : labels.delete}
          {...buttonProps}
          onClick={open}
        >
          {children}
        </Button>
      )}
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={confirm}
        tone="danger"
        title={title ?? labels.deleteTitle}
        question={question}
        detail={detail}
        confirmLabel={confirmLabel ?? labels.delete}
        isLoading={isDeleting}
        error={error}
      />
    </>
  );
}
