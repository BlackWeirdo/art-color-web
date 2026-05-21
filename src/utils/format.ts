/** Zero-pad number to 2 digits (e.g. 1 → "01", 12 → "12"). */
export const pad2 = (n: number): string => String(n).padStart(2, '0');
