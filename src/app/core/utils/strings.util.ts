export function getDottedLastCharacters(value: string, trimLength = 6): string {
  if (value.length > trimLength) {
    return value.substring(0, value.length - trimLength).concat(' ...');
  } else {
    return value;
  }
}

export function getDottedFirstCharacters(
  value: string,
  trimLength = 393
): string {
  if (value && value.length > trimLength) {
    return value.substring(0, trimLength).concat(' ...');
  } else {
    return value;
  }
}

export function getIndividualShortName(name: string): string {
  return name
    .split(/\s/)
    .reduce((shortName, word) => (shortName += word.slice(0, 1)), '');
}
