export function rideHeightDelta(
  front: number | null,
  rear: number | null
): number | null {

  if (
    front == null ||
    rear == null
  ) {

    return null;

  }

  return Number(
    (rear - front).toFixed(1)
  );

}
