import CornerGrid, {
  CornerGridRow,
} from "../../engineering/CornerGrid";

import { useTires } from "../../../hooks/useTires";

export default function PressurePanel() {

  const {
    tires,
    update,
  } = useTires();

  if (!tires) return null;

  const rows: CornerGridRow[] = [

    {
      label: "Cold Pressure",
      unit: "psi",
      values: {
        lf: tires.lf.coldPressure,
        rf: tires.rf.coldPressure,
        lr: tires.lr.coldPressure,
        rr: tires.rr.coldPressure,
      },
    },

    {
      label: "Hot Pressure",
      unit: "psi",
      values: {
        lf: tires.lf.hotPressure,
        rf: tires.rf.hotPressure,
        lr: tires.lr.hotPressure,
        rr: tires.rr.hotPressure,
      },
    },

    {
      label: "Final Pressure",
      unit: "psi",
      values: {
        lf: tires.lf.finalPressure,
        rf: tires.rf.finalPressure,
        lr: tires.lr.finalPressure,
        rr: tires.rr.finalPressure,
      },
    },

  ];

  function updateRow(
    row: number,
    corner: "lf" | "rf" | "lr" | "rr",
    value: number
  ) {

    const copy = structuredClone(tires);

    switch (row) {

      case 0:
        copy[corner].coldPressure = value;
        break;

      case 1:
        copy[corner].hotPressure = value;
        break;

      case 2:
        copy[corner].finalPressure = value;
        break;

    }

    update(copy);

  }

  return (

    <CornerGrid

      title="Pressures"

      rows={rows}

      onChange={updateRow}

    />

  );

}
