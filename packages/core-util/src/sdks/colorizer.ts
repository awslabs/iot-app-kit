import difference from 'lodash-es/difference';
import { colorPalette } from './colorPalette';

type Colorable = { color?: string };

export const Colorizer = (palette: string[] = colorPalette) => {
  let colors = [...palette];

  /**
   * Reset the color rotation back to the original state
   */
  const reset = () => {
    colors = [...palette];
  };

  /**
   * @returns if the color rotation is empty
   */
  const noColors = () => colors.length === 0;

  /**
   * @param color the color(s) you want to add to the front of the rotation to be used next
   */
  const add = (color: string | string[]) => {
    const toAdd = Array.isArray(color) ? color : [color];
    colors = [...toAdd, ...colors];
  };

  /**
   * @param color the color(s) you want to remove from the rotation so that they are not used in the rotation
   */
  const remove = (color: string | string[]) => {
    const toRemove = Array.isArray(color) ? color : [color];
    colors = difference(colors, toRemove);
    if (noColors()) reset();
  };

  /**
   * @returns the next color in the rotation
   */
  const next = () => {
    if (noColors()) reset();

    const nextColor = colors.at(0);
    colors = colors.slice(1);

    return nextColor;
  };

  /**
   * @param item an object with a color property
   * @returns the object with the color property set to the next color in the rotation
   */
  const nextApply = <T extends Colorable>(item: T): T => {
    const color = next();
    return {
      ...item,
      color,
    };
  };

  return {
    add,
    remove,
    next,
    nextApply,
  };
};
