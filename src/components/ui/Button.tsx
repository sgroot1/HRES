interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`${variant} ${className}`}
      {...props}
    />
  );
}
