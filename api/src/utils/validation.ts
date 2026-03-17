export function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeEmail(value: unknown): string {
  return normalizeString(value).toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email_regex.test(email);
}

export function isIntegerInRange(
  value: unknown,
  min: number,
  max: number,
): boolean {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

export function isNonNegativeInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export function isPositiveInteger(value: unknown): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export function isValidIsoLikeDate(value: unknown): boolean {
  if (typeof value !== 'string' || !value.trim()) return false;

  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
}
