export function adjustHex(hex: string, percentage: number): string {
  // Remove the '#' symbol from the hex code
  hex = hex.replace("#", "");

  // Convert the hex code to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the new RGB values based on the percentage
  const newR = Math.round(r * (1 - percentage / 100));
  const newG = Math.round(g * (1 - percentage / 100));
  const newB = Math.round(b * (1 - percentage / 100));

  // Convert the new RGB values back to a hex code
  const newHex = `#${newR.toString(16)}${newG.toString(16)}${newB.toString(
    16
  )}`;

  return newHex;
}
