export const pxToPercent = (px: number, totalPx: number): number =>
  (px / totalPx) * 100;

export const pxToEm = (px: number): number =>
  px / parseFloat(getComputedStyle(document.documentElement).fontSize);

export const emToPx = (em: number): number =>
  em * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const remToPx = (rem: number): number =>
  rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const pxToRem = (px: number, base = 16): number => px / base;

export const perToPx = (n: number): number => n / 100;
