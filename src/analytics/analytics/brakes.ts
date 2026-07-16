export function brakeBiasDelta(
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
    (front - rear).toFixed(1)
  );

}
