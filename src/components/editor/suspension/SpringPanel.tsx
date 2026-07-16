import CornerGrid, {
  CornerGridRow,
} from "../../engineering/CornerGrid";

import { useSuspension } from "../../../hooks/useSuspension";

export default function SpringPanel() {

  const {
    suspension,
    update,
  } = useSuspension();

  if (!suspension) return null;

  const rows: CornerGridRow[] = [

    {
      label: "Spring Rate",
      unit: "lb/in",
      values: {
        lf: suspension.lf.springRate,
        rf: suspension.rf.springRate,
        lr: suspension.lr.springRate,
        rr: suspension.rr.springRate,
      },
    },

    {
      label: "Preload",
      unit: "turns",
      values: {
        lf: suspension.lf.springPreload,
        rf: suspension.rf.springPreload,
        lr: suspension.lr.springPreload,
        rr: suspension.rr.springPreload,
      },
    },

  ];

  function updateRow(
    row: number,
    corner: "lf" | "rf" | "lr" | "rr",
    value: number
  ) {

    const copy = structuredClone(suspension);

    switch (row) {

      case 0:
        copy[corner].springRate = value;
        break;

      case 1:
        copy[corner].springPreload = value;
        break;

    }

    update(copy);

  }

  return (
    <CornerGrid
      title="Springs"
      rows={rows}
      onChange={updateRow}
    />
  );
}
