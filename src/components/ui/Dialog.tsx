import { ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose(): void;
}

export default function Dialog({
  open,
  title,
  children,
  onClose,
}: Props) {

  if (!open) return null;

  return (
    <div className="dialog-backdrop">

      <div className="dialog">

        <div className="dialog-header">

          <h2>{title}</h2>

          <button
            className="secondary"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}
