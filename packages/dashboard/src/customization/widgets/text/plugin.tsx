import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import TextWidgetComponent from './component';
import { TextWidget } from '../types';
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
        height: 50,
        width: 150,
      },
    });
  },
};
