export function getDottedLastCharacters(value: string, trimLength = 6): string {
  if (value.length > trimLength) {
    return value.substring(0, value.length - trimLength).concat(' ...');
  } else {
    return value;
  }
}

export function getDottedFirstCharacters(
  value: string,
  trimLength = 100
): string {
  if (value.length > trimLength) {
    return value.substring(0, trimLength).concat(' ...');
  } else {
    return value;
  }
}
