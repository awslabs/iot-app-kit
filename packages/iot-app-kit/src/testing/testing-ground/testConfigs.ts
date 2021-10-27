import { ChartConfig, DataStreamInfo, DataType } from '@synchro-charts/core';
import { getPalette, PalletScheme } from '../../palettes';

const pallet = getPalette(PalletScheme.QUALITATIVE_MUTED, 5);

const infos: DataStreamInfo[] = [
  {
    id: 'some-id',
    name: 'high',
    resolution: 0,
    detailedName: '/amazon/stocks/high',
    color: pallet[0],
    unit: 'USD',
    dataType: DataType.NUMBER,
  },
];

// DO NOT USE THIS IN UNIT TESTS. FOR TESTING GROUND ONLY!

// NOTE: Need to iterate on the typing for charts so that a chart config externally doesn't require
//  a viewport y range, but internally it does.
// @ts-ignore
export const TESTING_GROUND_CHART_CONFIG: ChartConfig & { dataStreamInfo: DataStreamInfo[] } = {
  widgetId: 'fake-id',
  viewport: {
    start: new Date(1998, 0, 0),
    end: new Date(2000, 0, 1),
  },
  dataStreamInfo: infos,
};
