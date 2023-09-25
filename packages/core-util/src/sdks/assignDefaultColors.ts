import { colorPalette } from './colorPalette';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type GenericObject = { [key: string]: any };

const defaultColorPicker = () => {
  let colorIndexOffset = 0;

  return (colorableItem: GenericObject, offset?: number) => {
    const indexOffset = offset ?? colorIndexOffset++;
    const color = colorPalette[indexOffset % colorPalette.length];
    return {
      ...colorableItem,
      color: colorableItem.color || color,
    };
  };
};
export const assignDefaultColor = defaultColorPicker();
