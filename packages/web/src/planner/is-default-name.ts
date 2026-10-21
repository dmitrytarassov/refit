/** True for an empty name or the placeholder text typed back in. */
export function isDefaultName(name: string, untitled: string): boolean {
  const trimmed = name.trim();
  return trimmed === "" || trimmed.toLowerCase() === untitled.toLowerCase();
}
