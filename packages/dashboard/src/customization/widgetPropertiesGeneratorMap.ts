import { AnyWidget } from '../types';

/**
 * map of widget type to a generator func to create properties when this widget is dropped into the grid
 *
 * also the initial size of that widget in real pixels
 *
 */
export const WidgetPropertiesGeneratorMap: {
  [key in string]: {
    //eslint-disable-next-line
    properties?: () => Record<any, any>;
    initialSize?: Pick<AnyWidget, 'height' | 'width'>;
  };
} = {};
