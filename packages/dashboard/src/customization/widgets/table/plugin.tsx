import TableWidgetComponent from './component';
import TableIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { TableWidget } from '../types';
import {
  TABLE_WIDGET_INITIAL_HEIGHT,
  TABLE_WIDGET_INITIAL_WIDTH,
} from '../constants';

export const tablePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<TableWidget>('table', {
      render: (widget: TableWidget) => <TableWidgetComponent {...widget} />,
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
        height: TABLE_WIDGET_INITIAL_HEIGHT,
        width: TABLE_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
