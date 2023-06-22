import { colorPalette } from '@iot-app-kit/core-util';

const defaultColorPicker = () => {
  let colorIndexOffset = 0;

  return () => colorPalette[colorIndexOffset++ % colorPalette.length];
};
export const getColor = defaultColorPicker();
