interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <input
      placeholder="Search setups..."
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}
