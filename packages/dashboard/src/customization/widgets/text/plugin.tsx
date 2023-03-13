import React from 'react';
import TextWidgetComponent from './component';
import TextIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { TextWidget } from '../types';

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
        height: 50,
        width: 150,
      },
    });
  },
};
