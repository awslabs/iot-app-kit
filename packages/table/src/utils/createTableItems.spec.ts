import { DataStream, Viewport } from '@iot-app-kit/core';
import { Annotations, COMPARISON_OPERATOR, getThresholds } from '@synchro-charts/core';
import { createTableItems } from './createTableItems';

const dataStreams: DataStream[] = [
  {
    id: 'data-1',
    data: [
      { y: 0, x: new Date(2021, 1, 1, 0, 0, 1).getTime() },
      { y: 1, x: new Date(2022, 1, 1, 0, 0, 2).getTime() },
      { y: 2, x: new Date(2022, 1, 1, 0, 0, 3).getTime() },
      { y: 3, x: new Date(2022, 1, 1, 0, 0, 4).getTime() },
      { y: 4, x: new Date(2022, 1, 1, 0, 0, 5).getTime() },
    ],
    resolution: 0,
  },
  {
    id: 'data-2',
    data: [{ y: 11, x: new Date(2022, 1, 1, 0, 0, 1).getTime() }],
    resolution: 0,
  },
  {
    id: 'agg_data',
    aggregates: {
      60: [{ y: 60, x: new Date(2022, 1, 1, 0, 0, 1).getTime() }],
    },
    data: [{ y: 0, x: new Date(2022, 1, 1, 0, 0, 1).getTime() }],
    resolution: 60,
  },
];

const viewport = {
  duration: '1000',
};

const itemWithRef = [
  {
    value1: {
      $cellRef: {
        id: 'data-1',
        resolution: 0,
      },
      noRef: 'No Ref',
    },
    value2: {
      $cellRef: {
        id: 'data-2',
        resolution: 0,
      },
    },
    noRef: {
      data: [1, 2, 3, 4],
    },
    rawValue: 10,
  },
  {
    data: {
      $cellRef: {
        id: 'data-1',
        resolution: 0,
      },
    },
    invalid: {
      $cellRef: {
        id: 'invalid-data-stream',
        resolution: 0,
      },
    },
    aggregates: {
      $cellRef: {
        id: 'agg_data',
        resolution: 60,
      },
    },
    invalidAggregation: {
      $cellRef: {
        id: 'agg_data',
        resolution: 55,
      },
    },
  },
];

it('creates table items', () => {
  const items = createTableItems({ dataStreams, viewport, items: itemWithRef });
  expect(items).toMatchObject([
    {
      value1: { value: 4 },
      value2: { value: 11 },
      noRef: {
        value: {
          data: [1, 2, 3, 4],
        },
      },
      rawValue: { value: 10 },
    },
    {
      data: { value: 4 },
      invalid: { value: undefined },
      aggregates: { value: 60 },
      invalidAggregation: { value: undefined },
    },
  ]);
});

it('returns value as it is a primitive value', () => {
  const items = createTableItems({ dataStreams, viewport, items: itemWithRef });
  const data = items[0].value1;
  expect((data as number) + 1).toBe(5);
});

it('gets different data points on different viewports on the same data stream', () => {
  const viewport1: Viewport = {
    start: new Date(2022, 1, 1, 0, 0, 1),
    end: new Date(2022, 1, 1, 0, 0, 2),
  };

  const viewport2 = {
    start: new Date(2022, 1, 1, 0, 0, 1),
    end: new Date(2022, 1, 1, 0, 0, 3),
  };

  const itemDef = [
    {
      value1: {
        $cellRef: {
          id: 'data-1',
          resolution: 0,
        },
      },
    },
  ];
  const items1 = createTableItems({ dataStreams, viewport: viewport1, items: itemDef });
  const items2 = createTableItems({ dataStreams, viewport: viewport2, items: itemDef });

  expect(items1).not.toEqual(items2);
});

it('returns undefined value when no data points in data stream', () => {
  // no data point would match this viewport
  const viewport1: Viewport = {
    start: new Date(2020, 1, 1, 0),
    end: new Date(2021, 1, 1, 0),
  };
  const itemDef = [
    {
      noDataPoints: {
        $cellRef: {
          id: 'data-1',
          resolution: 0,
        },
      },
    },
  ];
  const items1 = createTableItems({ dataStreams, viewport: viewport1, items: itemDef });
  expect(items1).toMatchObject([{ noDataPoints: { value: undefined } }]);
});

it('contains breached threshold', () => {
  const thresholdOne = {
    value: 1,
    color: 'red',
    comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
    dataStreamIds: ['data-1'],
  };
  const thresholdTwo = {
    value: 0,
    color: 'black',
    comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  };

  const annotations: Annotations = {
    y: [
      // only apply to data stream 'data-1'
      thresholdOne,

      // apply to both data stream
      thresholdTwo,
    ],
  };

  const items = [
    {
      itemOne: {
        $cellRef: {
          id: 'data-1',
          resolution: 0,
        },
      },
      itemTwo: {
        $cellRef: {
          id: 'data-2',
          resolution: 0,
        },
      },

      noRef: 10,
    },
  ];

  const tableItems = createTableItems({
    dataStreams,
    viewport,
    items,
    thresholds: getThresholds(annotations),
  });

  const { itemOne, itemTwo, noRef } = tableItems[0];

  expect(itemOne.threshold).toMatchObject(thresholdOne);
  expect(itemTwo.threshold).toMatchObject(thresholdTwo);

  // Item with no $cellRef does not support threshold
  expect(noRef).toMatchObject({ threshold: undefined });
});
