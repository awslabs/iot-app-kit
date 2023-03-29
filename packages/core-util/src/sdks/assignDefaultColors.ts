import { colorPalette } from './colorPalette';

export const assignDefaultColor: <T extends { color?: string }>(colorableItem: T, colorIndexOffset?: number) => T = (
  colorableItem,
  colorIndexOffset = 0
) => {
  return {
    ...colorableItem,
    color: colorableItem.color || colorPalette[colorIndexOffset % colorPalette.length],
  };
};
