import React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { DataStream, Viewport } from '@iot-app-kit/core';
import { Annotations, COMPARISON_OPERATOR, getThresholds, StatusIcon } from '@synchro-charts/core';
import { ColumnDefinition, createTableItems, DefaultTableMessages, Item } from '../utils';
import { Table } from './index';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const dataStreamId = 'datastream-1';
const dataStream: DataStream = {
  id: dataStreamId,
  data: [
    { x: new Date(2021, 1, 1).getTime(), y: 100 },
    { x: new Date(2022, 1, 1).getTime(), y: 200 },
  ],
  resolution: 0,
};

const items: Item[] = [
  {
    value: {
      $cellRef: {
        id: dataStreamId,
        resolution: 0,
      },
    },
  },
];

const columnDefinitions: ColumnDefinition[] = [
  {
    header: 'value',
    key: 'value',
  },
];

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
});

it('renders correct data when viewport defined by duration', async () => {
  const tableItems = createTableItems(
    {
      dataStreams: [dataStream],
      items,
      viewport: {
        duration: '1000',
      },
    },
    DefaultTableMessages
  );

  act(() => {
    ReactDOM.render(
      <Table columnDefinitions={columnDefinitions} messageOverrides={DefaultTableMessages} items={tableItems} />,
      container
    );
  });

  const cell = container.getElementsByClassName('iot-table-cell').item(0) as HTMLDivElement;
  expect(cell.innerHTML).toMatch('200');
});

it('renders correct data when the viewport defined by start and end time', async () => {
  const viewport: Viewport = {
    start: new Date(2021, 0, 0, 0, 0, 0),
    end: new Date(2021, 12, 30, 0, 0, 0),
  };
  const tableItems = createTableItems({ dataStreams: [dataStream], items, viewport }, DefaultTableMessages);
  act(() => {
    ReactDOM.render(
      <Table columnDefinitions={columnDefinitions} messageOverrides={DefaultTableMessages} items={tableItems} />,
      container
    );
  });

  const cell = container.getElementsByClassName('iot-table-cell').item(0) as HTMLDivElement;
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
    DefaultTableMessages
  );

  act(() => {
    ReactDOM.render(
      <Table columnDefinitions={columnDefinitions} messageOverrides={DefaultTableMessages} items={tableItems} />,
      container
    );
  });

  const svg = container.getElementsByTagName('svg').item(0) as SVGElement;
  expect(svg).toBeTruthy();
});

it('renders icon and applies style when a datastream breaches threshold', async () => {
  const annotations: Annotations = {
    y: [
      {
        color: 'red',
        value: 30,
        comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
        icon: StatusIcon.ERROR,
        dataStreamIds: [dataStreamId],
      },
    ],
  };
  const tableItems = createTableItems(
    { dataStreams: [dataStream], items, viewport: { duration: '1000' }, thresholds: getThresholds(annotations) },
    DefaultTableMessages
  );

  act(() => {
    ReactDOM.render(
      <Table columnDefinitions={columnDefinitions} messageOverrides={DefaultTableMessages} items={tableItems} />,
      container
    );
  });

  const cell = container.getElementsByClassName('iot-table-cell').item(0) as HTMLDivElement;
  expect(cell.style.color).toEqual('red');
  const iconContainer = cell.childNodes.item(0);
  expect(iconContainer).toBeTruthy();
  const text = cell.childNodes.item(1) as Text;
  expect(text.wholeText).toMatch('200');
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
    DefaultTableMessages
  );

  act(() => {
    ReactDOM.render(
      <Table columnDefinitions={columnDefinitions} messageOverrides={DefaultTableMessages} items={tableItems} />,
      container
    );
  });

  const cell = container.getElementsByClassName('iot-table-cell').item(0) as HTMLDivElement;
  const iconContainer = cell.childNodes.item(0);
  expect(iconContainer).toBeTruthy();

  const text = cell.childNodes.item(1) as Text;
  expect(text.wholeText).toMatch('Error');
});
