import { ComponentTag } from '~/types';

export type ComponentPaletteDraggable = {
  componentTag: ComponentTag;
  rect: DOMRect | null;
};
