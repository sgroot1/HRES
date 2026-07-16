import { Fragment } from "react";

export interface CornerValues {
  lf: number | null;
  rf: number | null;
  lr: number | null;
  rr: number | null;
}

export interface CornerGridRow {
  label: string;
  unit: string;
  values: CornerValues;
}

interface Props {
  title: string;

  rows: CornerGridRow[];

  onChange: (
    rowIndex: number,
    corner: keyof CornerValues,
    value: number
  ) => void;
}

const corners: (keyof CornerValues)[] = [
  "lf",
  "rf",
  "lr",
  "rr",
];

export default function CornerGrid({
  title,
  rows,
  onChange,
}: Props) {
  return (
    <div className="corner-panel">

      <h2>{title}</h2>

      <div className="corner-grid">

        <div></div>

        <strong>LF</strong>

        <strong>RF</strong>

        <strong>LR</strong>

        <strong>RR</strong>

        {rows.map((row, rowIndex) => (
          <Fragment key={row.label}>
            <label className="corner-row-label">

              {row.label}

              <span className="corner-unit">

                [{row.unit}]

              </span>

            </label>

            {corners.map((corner) => (
              <input
                key={`${row.label}-${corner}`}
                className="corner-input"
                type="number"
                value={row.values[corner] ?? ""}
                onChange={(event) =>
                  onChange(
                    rowIndex,
                    corner,
                    Number(event.target.value)
                  )
                }
              />
            ))}
          </Fragment>
        ))}

      </div>

    </div>
  );
}
