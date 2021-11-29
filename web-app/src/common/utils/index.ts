export function toLocaleString(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString();
}
