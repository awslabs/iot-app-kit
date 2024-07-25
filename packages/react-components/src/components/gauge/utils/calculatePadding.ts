export const calculatePadding = ({
  fontSize = 0,
  unitFontSize = 0,
}: {
  fontSize?: number;
  unitFontSize?: number;
}) => {
  if (fontSize > unitFontSize) {
    return -1 * ((fontSize - unitFontSize) / 2);
  } else if (fontSize < unitFontSize) {
    return (unitFontSize - fontSize) / 2;
  } else {
    return 0;
  }
};
