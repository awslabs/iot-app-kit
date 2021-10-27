import { DataStreamInfo, DataType, LEGEND_POSITION } from '@synchro-charts/core';
import { DAY_IN_MS } from '../../utils/time';

export const pallet = ['#0073bb', '#dd6b10', '#1d8102', '#8b3333'];

export const DATA_STREAM_ID_WITH_STRING = 'some-id-3';

const infos: DataStreamInfo[] = [
  {
    id: 'some-id-1',
    resolution: DAY_IN_MS,
    name: 'Asset 1',
    detailedName: 'Asset 1 - Factory 1',
    color: pallet[0],
    unit: 'm/s',
    dataType: DataType.NUMBER,
  },
  {
    id: 'some-id-2',
    resolution: DAY_IN_MS,
    name: 'Asset 2',
    detailedName: 'Asset 2 - Factory 2',
    color: pallet[1],
    unit: 'm/s',
    dataType: DataType.NUMBER,
  },
  {
    id: DATA_STREAM_ID_WITH_STRING,
    resolution: DAY_IN_MS,
    name: 'Asset 3',
    detailedName: 'Asset 3 - Factory 3',
    color: pallet[2],
    dataType: DataType.STRING,
  },
];

// DO NOT USE THIS IN UNIT TESTS. FOR TESTING GROUND ONLY!

// NOTE: Need to iterate on the typing for charts so that a chart config externally doesn't require
//  a viewport y range, but internally it does.
// @ts-ignore
export const TESTING_GROUND_CHART_CONFIG: ChartConfig & { dataStreamInfo: DataStreamInfo[] } = {
  widgetId: 'fake-id',
  legend: {
    position: LEGEND_POSITION.BOTTOM,
    width: 170,
  },
  viewport: {
    start: new Date(1998, 0, 0),
    end: new Date(2000, 0, 1),
  },
  dataStreamInfo: infos,
};
