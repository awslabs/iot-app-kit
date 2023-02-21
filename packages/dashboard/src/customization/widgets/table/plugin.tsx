import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import { TableWidget } from '../types';
import TableWidgetComponent from './component';
import TableIcon from './icon';

export const tablePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<TableWidget>('iot-table', {
      render: (widget) => (
        <MultiQueryWidget {...widget}>
          <TableWidgetComponent {...widget} />
        </MultiQueryWidget>
      ),
      componentLibrary: {
        name: 'Table',
        icon: TableIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
      }),
      initialSize: {
        height: 170,
        width: 270,
      },
    });
  },
};
