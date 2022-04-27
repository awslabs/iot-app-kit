import { DataStream, Viewport } from '@iot-app-kit/core';
import { createTableItems } from '../components/iot-table/createTableItems';

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
  },
];

describe('createTableItems method', () => {
  it('should create table items', () => {
    const items = createTableItems({ dataStreams, viewport, items: itemWithRef });
    expect(items).toEqual([
      {
        value1: 4,
        value2: 15,
        noRef: {
          data: [1, 2, 3, 4],
        },
        rawValue: 10,
      },
      { data: 4, invalid: undefined },
    ]);
  });

  it('should get different data points on different viewports on the same data stream', () => {
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
});
