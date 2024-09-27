export const getDecimalPlaces = (num?: number | string | null) => {
  if (!num) return 0;
  const numToString = num.toString().replace(/\s+/g, '').split('.');
  return numToString.length > 1 ? numToString[1].length : 0;
};
