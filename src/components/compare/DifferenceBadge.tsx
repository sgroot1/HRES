interface Props {
  changed: boolean;
}

export default function DifferenceBadge({
  changed,
}: Props) {

  return (
    <span
      className={
        changed
          ? "status approved"
          : "status archived"
      }
    >
      {changed ? "Changed" : "Same"}
    </span>
  );

}
