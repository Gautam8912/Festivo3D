import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
export default function Modal({ children, title, onClose, className = "" }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (
        e.key === "Tab" &&
        !ref.current?.contains(document.activeElement)
      ) {
        e.preventDefault();
        ref.current
          ?.querySelector("button:not(:disabled),input,select,a[href]")
          ?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector("button,input,select,a[href]")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        ref={ref}
        className={"studio-modal " + className}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Tab") {
            const all = [
              ...ref.current.querySelectorAll(
                "button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href]",
              ),
            ];
            if (e.shiftKey && document.activeElement === all[0]) {
              e.preventDefault();
              all.at(-1)?.focus();
            } else if (!e.shiftKey && document.activeElement === all.at(-1)) {
              e.preventDefault();
              all[0]?.focus();
            }
          }
        }}
      >
        <button
          className="icon-button modal-close"
          aria-label={`Close ${title}`}
          onClick={onClose}
        >
          <X size={20} />
        </button>
        {children}
      </section>
    </div>
  );
}
