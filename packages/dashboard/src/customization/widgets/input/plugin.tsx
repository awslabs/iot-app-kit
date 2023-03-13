import React from 'react';
import InputWidgetComponent from './component';
import InputIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { InputWidget } from '../types';

export const inputPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<InputWidget>('input', {
      render: (widget) => <InputWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Input',
        icon: InputIcon,
      },
      properties: () => ({
        writeConfig: {
          source: 'iotsitewise',
          resource: undefined,
        },
        options: [],
        selectedOption: undefined,
      }),
      initialSize: {
        height: 50,
        width: 270,
      },
    });
  },
};
