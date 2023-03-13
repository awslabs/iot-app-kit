import React from 'react';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import TableWidgetComponent from './component';
import TableIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { TableWidget } from '../types';

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
