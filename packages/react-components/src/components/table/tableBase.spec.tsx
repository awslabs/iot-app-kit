import type { DataStream, Viewport } from '@iot-app-kit/core';
import { COMPARISON_OPERATOR, STATUS_ICON_TYPE } from '@iot-app-kit/core';
import { createTableItems } from './createTableItems';
import { TableBase } from './tableBase';
import { DEFAULT_TABLE_MESSAGES } from './messages';
import { render, screen } from '@testing-library/react';
import type { TableColumnDefinition, TableItem } from './types';

const dataStreamId = 'datastream-1';
const dataStream: DataStream = {
  id: dataStreamId,
  data: [
    { x: new Date(2021, 1, 1).getTime(), y: 100 },
    { x: new Date(2022, 1, 1).getTime(), y: 200 },
  ],
  resolution: 0,
};

const items: TableItem[] = [
  {
    value: {
      $cellRef: {
        id: dataStreamId,
        resolution: 0,
      },
    },
  },
];

const columnDefinitions: TableColumnDefinition[] = [
  {
    header: 'value',
    key: 'value',
  },
];

it('renders correct data when viewport defined by duration', async () => {
  const tableItems = createTableItems(
    {
      dataStreams: [dataStream],
      items,
      viewport: {
        duration: '1000',
      },
    },
    DEFAULT_TABLE_MESSAGES
  );

  const { container } = render(
    <TableBase
      columnDefinitions={columnDefinitions}
      messageOverrides={DEFAULT_TABLE_MESSAGES}
      items={tableItems}
    />
  );

  const cell = container
    .getElementsByClassName('iot-table-cell')
    .item(0) as HTMLDivElement;
  expect(cell.innerHTML).toMatch('200');
});

it('renders correct data when the viewport defined by start and end time', async () => {
  const viewport: Viewport = {
    start: new Date(2021, 0, 0, 0, 0, 0),
    end: new Date(2021, 12, 30, 0, 0, 0),
  };
  const tableItems = createTableItems(
    { dataStreams: [dataStream], items, viewport },
    DEFAULT_TABLE_MESSAGES
  );
  const { container } = render(
    <TableBase
      columnDefinitions={columnDefinitions}
      messageOverrides={DEFAULT_TABLE_MESSAGES}
      items={tableItems}
    />
  );

  const cell = container
    .getElementsByClassName('iot-table-cell')
    .item(0) as HTMLDivElement;
  expect(cell.innerHTML).toMatch('100');
});

it('renders loading circle when datastream is in loading state', async () => {
  const loadingDatastream: DataStream = {
    isLoading: true,
    data: [],
    id: dataStreamId,
    resolution: 0,
  };
  const tableItems = createTableItems(
    { dataStreams: [loadingDatastream], items, viewport: { duration: '1000' } },
    DEFAULT_TABLE_MESSAGES
  );

  const { container } = render(
    <TableBase
      columnDefinitions={columnDefinitions}
      messageOverrides={DEFAULT_TABLE_MESSAGES}
      items={tableItems}
    />
  );

  const svg = container.getElementsByTagName('svg').item(0) as SVGElement;
  expect(svg).toBeTruthy();
});

it('renders icon and applies style when a datastream breaches threshold', async () => {
  const tableItems = createTableItems(
    {
      dataStreams: [dataStream],
      items,
      viewport: { duration: '1000' },
      thresholds: [
        {
          color: 'red',
          value: 30,
          comparisonOperator: COMPARISON_OPERATOR.GT,
          icon: STATUS_ICON_TYPE.error,
          dataStreamIds: [dataStreamId],
        },
      ],
    },
    DEFAULT_TABLE_MESSAGES
  );

  const { container } = render(
    <TableBase
      columnDefinitions={columnDefinitions}
      messageOverrides={DEFAULT_TABLE_MESSAGES}
      items={tableItems}
    />
  );

  const cell = container
    .getElementsByClassName('iot-table-cell')
    .item(0) as HTMLDivElement;
  expect(cell.style.color).toEqual('red');
  const iconContainer = cell.childNodes.item(0);
  expect(iconContainer).toBeTruthy();
  expect(screen.getByText('200')).toBeVisible();
});

it('renders icon and displays error message when datastream is in error state', () => {
  const tableItems = createTableItems(
    {
      dataStreams: [
        {
          data: [],
          id: dataStreamId,
          error: {
            msg: 'Error',
          },
          resolution: 0,
        },
      ],
      items,
      viewport: { duration: '1000' },
    },
    DEFAULT_TABLE_MESSAGES
  );

  const { container } = render(
    <TableBase
      columnDefinitions={columnDefinitions}
      messageOverrides={DEFAULT_TABLE_MESSAGES}
      items={tableItems}
    />
  );

  const cell = container
    .getElementsByClassName('iot-table-cell')
    .item(0) as HTMLDivElement;
  const iconContainer = cell.childNodes.item(0);
  expect(iconContainer).toBeTruthy();

  expect(screen.getByText('Error')).toBeVisible();
});
