import { colorPalette } from './colorPalette';

const defaultColorPicker = () => {
  let colorIndexOffset = 0;

  return (colorableItem: any, offset?: number) => {
    const indexOffset = offset ?? colorIndexOffset++;
    const color = colorPalette[indexOffset % colorPalette.length];
    return {
      ...colorableItem,
      color: colorableItem.color || color,
    };
  };
};
export const assignDefaultColor = defaultColorPicker();
