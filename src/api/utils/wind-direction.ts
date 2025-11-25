export function windDegreesToDirection(deg: number): string {
  if (deg >= 337.5 || deg < 22.5) return "N";
  if (deg >= 22.5 && deg < 67.5) return "NO";
  if (deg >= 67.5 && deg < 112.5) return "Ö";
  if (deg >= 112.5 && deg < 157.5) return "SO";
  if (deg >= 157.5 && deg < 202.5) return "S";
  if (deg >= 202.5 && deg < 247.5) return "SV";
  if (deg >= 247.5 && deg < 292.5) return "V";
  if (deg >= 292.5 && deg < 337.5) return "NV";
  return "?";
}