export function getDifferenceBetweenArray(
  firstValue: string[],
  secondValue: string[]
): string[] {
  return firstValue.filter(
    firstId => !secondValue.some(secondId => secondId === firstId)
  );
}
