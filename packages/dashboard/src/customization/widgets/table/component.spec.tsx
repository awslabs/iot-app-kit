import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react';

import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';

import TableWidgetComponent from './component';
import type { TableWidget } from '../types';

const widget: TableWidget = {
  type: 'table',
  id: '123',
  x: 12,
  y: 3,
  z: 0,
  height: 15,
  width: 43,
  properties: {
    queryConfig: { source: 'iotsitewise', query: undefined },
    columnDefinitions: [
      {
        key: 'property',
        header: 'Property',
        sortingField: 'property',
      },
      {
        key: 'value',
        header: 'Latest value',
        sortingField: 'value',
      },
      {
        key: 'unit',
        header: 'Unit',
        sortingField: 'unit',
      },
    ],
    items: [],
  },
};
it('renders', async () => {
  const getState = (stretchToFit: boolean) => ({
    ...initialState,
    grid: { ...initialState.grid, width: 100, height: 100, cellSize: 20, stretchToFit },
  });
  const { getByTestId } = render(
    <Provider store={configureDashboardStore(getState(false))}>
      <TableWidgetComponent {...widget} />
    </Provider>
  );
  expect(getByTestId('table-widget-component')).toBeInTheDocument();
});
