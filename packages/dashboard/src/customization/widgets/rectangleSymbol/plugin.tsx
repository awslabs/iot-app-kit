import RectangleWidgetComponent from './component';
import RectangleIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import { type RectangleWidget } from '../types';

export const rectanglePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<RectangleWidget>('rectangle', {
      render: (widget) => <RectangleWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Rectangle',
        icon: RectangleIcon,
      },
      properties: () => ({
        borderStyle: 'solid',
        fill: 'none',
        borderColor: 'black',
        borderThickness: 5,
      }),
      initialSize: {
        width: 200,
        height: 100,
      },
    });
  },
};
