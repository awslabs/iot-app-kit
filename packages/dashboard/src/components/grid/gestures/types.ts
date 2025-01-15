import { type Position } from '~/types';

export type DragEvent = {
  target?: EventTarget;
  start: Position;
  end: Position;
  vector: Position;
  union: boolean;
};
export type PointClickEvent = {
  target?: EventTarget;
  position: Position;
  union: boolean;
};

export type DropEvent = {
  position: Position;
  item: {
    componentTag: string;
  };
};
