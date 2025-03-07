import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export interface ComponentPaletteDraggable<
  WidgetType extends RegisteredWidgetType
> {
  widgetType: WidgetType;
  rect: DOMRect | null;
}
