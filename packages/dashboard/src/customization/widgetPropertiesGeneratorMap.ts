import type { DashboardWidget } from '~/types';

/**
 * map of widget type to a generator func to create properties when this widget is dropped into the grid
 *
 * also the initial size of that widget in real pixels
 *
 */

type WidgetPropertiesGenerator<W extends DashboardWidget = DashboardWidget> = {
  [key in string]: {
    properties?: () => W['properties'];
    initialSize?: Pick<W, 'height' | 'width'>;
  };
};
export const WidgetPropertiesGeneratorMap: WidgetPropertiesGenerator = {};
