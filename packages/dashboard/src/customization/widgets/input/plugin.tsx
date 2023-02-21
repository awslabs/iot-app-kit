import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import { InputWidget } from '../types';
import InputWidgetComponent from './component';
import InputIcon from './icon';

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
