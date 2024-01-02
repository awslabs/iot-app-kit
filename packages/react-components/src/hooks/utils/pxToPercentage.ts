export const pxToPercent = (px: number, totalPx: number): string => {
  return `${((px / totalPx) * 100).toFixed(0)}%`;
};
