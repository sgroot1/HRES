import DifferenceBadge from "./DifferenceBadge";

interface Props {

  label: string;

  left: string | number | null;

  right: string | number | null;

}

export default function CompareRow({

  label,

  left,

  right,

}: Props) {

  const changed = left !== right;

  return (

    <div className="compare-row">

      <div>{label}</div>

      <div>{left ?? "--"}</div>

      <div>{right ?? "--"}</div>

      <DifferenceBadge
        changed={changed}
      />

    </div>

  );

}
