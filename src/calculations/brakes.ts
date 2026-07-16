export function calculateBrakeBias(
  front: number | null,
  rear: number | null
): string {

  if (
    front == null ||
    rear == null
  ) {
    return "--";
  }

  return `${front}/${rear}`;

}
