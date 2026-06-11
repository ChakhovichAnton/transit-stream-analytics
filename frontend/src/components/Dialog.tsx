import { X } from "lucide-react";
import { type PropsWithChildren, useEffect, useRef } from "react";

interface DialogProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  closeDialogButton?: boolean;
}

const Dialog = ({
  isOpen,
  onClose,
  closeDialogButton,
  children,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window || !isOpen) return;

    // Close dialog if the user clicks outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        event.target instanceof Node &&
        !dialogRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div
        ref={dialogRef}
        className="relative bg-base rounded-2xl p-6 shadow-xl"
      >
        {closeDialogButton && (
          <button
            className="absolute top-1 right-1 hover:cursor-pointer"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Dialog;
