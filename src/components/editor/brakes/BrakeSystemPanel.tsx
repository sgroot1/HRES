import CornerGrid, {
  CornerGridRow,
} from "../../engineering/CornerGrid";

import { useBrakes } from "../../../hooks/useBrakes";

export default function BrakeSystemPanel() {

  const {
    brakes,
    update,
  } = useBrakes();

  if (!brakes) return null;

  const rows: CornerGridRow[] = [

    {
      label: "Rotor Temp",
      unit: "°F",
      values: {
        lf: brakes.lf.rotorTemperature,
        rf: brakes.rf.rotorTemperature,
        lr: brakes.lr.rotorTemperature,
        rr: brakes.rr.rotorTemperature,
      },
    },

    {
      label: "Pad Thickness",
      unit: "mm",
      values: {
        lf: brakes.lf.padThickness,
        rf: brakes.rf.padThickness,
        lr: brakes.lr.padThickness,
        rr: brakes.rr.padThickness,
      },
    },

    {
      label: "Brake Pressure",
      unit: "psi",
      values: {
        lf: brakes.lf.brakePressure,
        rf: brakes.rf.brakePressure,
        lr: brakes.lr.brakePressure,
        rr: brakes.rr.brakePressure,
      },
    },

    {
      label: "Brake Wear",
      unit: "%",
      values: {
        lf: brakes.lf.brakeWear,
        rf: brakes.rf.brakeWear,
        lr: brakes.lr.brakeWear,
        rr: brakes.rr.brakeWear,
      },
    },

  ];

  function updateRow(
    row: number,
    corner: "lf" | "rf" | "lr" | "rr",
    value: number
  ) {

    const copy = structuredClone(brakes);

    switch (row) {

      case 0:
        copy[corner].rotorTemperature = value;
        break;

      case 1:
        copy[corner].padThickness = value;
        break;

      case 2:
        copy[corner].brakePressure = value;
        break;

      case 3:
        copy[corner].brakeWear = value;
        break;

    }

    update(copy);

  }

  return (

    <CornerGrid

      title="Brake System"

      rows={rows}

      onChange={updateRow}

    />

  );

}
