import CornerGrid, {
  CornerGridRow,
} from "../../engineering/CornerGrid";

import { useTires } from "../../../hooks/useTires";

export default function TemperaturePanel() {

  const {
    tires,
    update,
  } = useTires();

  if (!tires) return null;

  const rows: CornerGridRow[] = [

    {
      label: "Inside",
      unit: "°F",
      values: {
        lf: tires.lf.insideTemp,
        rf: tires.rf.insideTemp,
        lr: tires.lr.insideTemp,
        rr: tires.rr.insideTemp,
      },
    },

    {
      label: "Middle",
      unit: "°F",
      values: {
        lf: tires.lf.middleTemp,
        rf: tires.rf.middleTemp,
        lr: tires.lr.middleTemp,
        rr: tires.rr.middleTemp,
      },
    },

    {
      label: "Outside",
      unit: "°F",
      values: {
        lf: tires.lf.outsideTemp,
        rf: tires.rf.outsideTemp,
        lr: tires.lr.outsideTemp,
        rr: tires.rr.outsideTemp,
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
        copy[corner].insideTemp = value;
        break;

      case 1:
        copy[corner].middleTemp = value;
        break;

      case 2:
        copy[corner].outsideTemp = value;
        break;

    }

    update(copy);

  }

  return (

    <CornerGrid

      title="Temperatures"

      rows={rows}

      onChange={updateRow}

    />

  );

}
