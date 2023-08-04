import { colorPalette } from '@iot-app-kit/core-util';

const defaultColorPicker = () => {
  let colorIndexOffset = 0;

  return (offset?: number) => {
    const indexOffset = offset ?? colorIndexOffset++;
    return colorPalette[indexOffset % colorPalette.length];
  };
};
export const getColor = defaultColorPicker();
