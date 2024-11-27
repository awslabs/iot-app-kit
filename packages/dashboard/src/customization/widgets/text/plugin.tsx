import type { DashboardPlugin } from '../../../customization/api';
import {
  TEXT_WIDGET_INITIAL_HEIGHT,
  TEXT_WIDGET_INITIAL_WIDTH,
} from '../constants';
import type { TextWidget } from '../types';
import TextWidgetComponent from './component';
import TextIcon from './icon';

export const textPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<TextWidget>('text', {
      render: (widget) => <TextWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Text',
        icon: TextIcon,
      },
      properties: () => ({
        value: '',
      }),
      initialSize: {
        height: TEXT_WIDGET_INITIAL_HEIGHT,
        width: TEXT_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
