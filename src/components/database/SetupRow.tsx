import { Setup } from "../../types/setup";

interface Props {
  setup: Setup;
  onOpen(): void;
  onDuplicate(): void;
  onDelete(): void;
}

export default function SetupRow({
  setup,
  onOpen,
  onDuplicate,
  onDelete,
}: Props) {
  return (
    <div>
      <h3>{setup.name}</h3>

      <button onClick={onOpen}>Open</button>
      <button onClick={onDuplicate}>Duplicate</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}
