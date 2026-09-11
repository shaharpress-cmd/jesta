/** Default example area until the user grants GPS / sets a real location. */
export const EXAMPLE_AREA = "תל אביב";
export const EXAMPLE_RADIUS_LABEL = '2 ק״מ';

/**
 * Header / map location string — always marked as example/default
 * until real permission-based location exists.
 */
export function exampleLocationChip(opts?: {
  area?: string;
  radiusLabel?: string;
  guest?: boolean;
}): string {
  const area = opts?.area ?? EXAMPLE_AREA;
  const radius = opts?.radiusLabel ?? EXAMPLE_RADIUS_LABEL;
  const tag = opts?.guest ? "אזור לדוגמה" : "ברירת מחדל";
  return `${area} · ${radius} · ${tag}`;
}
