import type { Position } from '~/types';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export interface DragEvent {
  target?: EventTarget;
  start: Position;
  end: Position;
  vector: Position;
  union: boolean;
}

export interface PointClickEvent {
  target?: EventTarget;
  position: Position;
  union: boolean;
}

export interface DropEvent<WidgetType extends RegisteredWidgetType> {
  position: Position;
  item: {
    widgetType: WidgetType;
  };
}
