import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: ReactNode;
}

/**
 * Standard panel/card wrapper used across the app so every section
 * (dashboard tiles, sidebar sections, setup columns, etc.) shares the
 * same background, border, spacing, and heading style.
 */
export default function Card({
  title,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <div className={`ui-card ${className}`} {...props}>
      {title && <h2 className="ui-card-title">{title}</h2>}
      {children}
    </div>
  );
}
