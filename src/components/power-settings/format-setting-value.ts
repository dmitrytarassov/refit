export function formatSettingValue(value: string): string {
  if (value === "mtb") {
    return "MTB";
  }
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
}
