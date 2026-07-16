import { Setup } from "../types/setup";

export interface SetupChange {

  section: string;

  field: string;

  previous: string;

  current: string;

}

export function compareSetups(
  previous: Setup | null,
  current: Setup | null
): SetupChange[] {

  if (!previous || !current) {
    return [];
  }

  const changes: SetupChange[] = [];

  function compare(
    section: string,
    field: string,
    oldValue: unknown,
    newValue: unknown
  ) {

    if (oldValue === newValue) {
      return;
    }

    changes.push({

      section,

      field,

      previous: String(oldValue ?? "--"),

      current: String(newValue ?? "--"),

    });

  }

  compare(
    "Tires",
    "LF Pressure",
    previous.tires.lf.coldPressure,
    current.tires.lf.coldPressure
  );

  compare(
    "Tires",
    "RF Pressure",
    previous.tires.rf.coldPressure,
    current.tires.rf.coldPressure
  );

  compare(
    "Tires",
    "LR Pressure",
    previous.tires.lr.coldPressure,
    current.tires.lr.coldPressure
  );

  compare(
    "Tires",
    "RR Pressure",
    previous.tires.rr.coldPressure,
    current.tires.rr.coldPressure
  );

  compare(
    "Suspension",
    "Front ARB",
    previous.suspension.frontArb,
    current.suspension.frontArb
  );

  compare(
    "Suspension",
    "Rear ARB",
    previous.suspension.rearArb,
    current.suspension.rearArb
  );

  compare(
    "Brakes",
    "Brake Bias",
    previous.brakes.bias,
    current.brakes.bias
  );

  compare(
    "Aero",
    "Front Wing",
    previous.aero.frontWing,
    current.aero.frontWing
  );

  compare(
    "Aero",
    "Rear Wing",
    previous.aero.rearWing,
    current.aero.rearWing
  );

  return changes;

}
