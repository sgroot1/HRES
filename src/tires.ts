import { SuspensionSetup } from "../types/suspension";

export function calculateFrontWeight(
  suspension: SuspensionSetup
): number | null {

  const {
    lf,
    rf,
    lr,
    rr,
  } = suspension;

  if (
    lf.cornerWeight == null ||
    rf.cornerWeight == null ||
    lr.cornerWeight == null ||
    rr.cornerWeight == null
  ) {
    return null;
  }

  const total =
    lf.cornerWeight +
    rf.cornerWeight +
    lr.cornerWeight +
    rr.cornerWeight;

  return Number(
    (
      (
        (lf.cornerWeight + rf.cornerWeight) /
        total
      ) * 100
    ).toFixed(1)
  );

}

export function calculateCrossWeight(
  suspension: SuspensionSetup
): number | null {

  const {
    lf,
    rf,
    lr,
    rr,
  } = suspension;

  if (
    lf.cornerWeight == null ||
    rf.cornerWeight == null ||
    lr.cornerWeight == null ||
    rr.cornerWeight == null
  ) {
    return null;
  }

  const total =
    lf.cornerWeight +
    rf.cornerWeight +
    lr.cornerWeight +
    rr.cornerWeight;

  return Number(
    (
      (
        (lf.cornerWeight + rr.cornerWeight) /
        total
      ) * 100
    ).toFixed(1)
  );

}
