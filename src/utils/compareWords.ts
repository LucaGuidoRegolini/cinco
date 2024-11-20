export function normalizeString(str: string): string {
  return str
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function findStringInArray(target: string, array: string[]): string | undefined {
  const normalizedTarget = normalizeString(target);

  return array.find((item) => normalizeString(item) === normalizedTarget);
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
