import { DEFAULT_CHART_CONFIG } from '../webgl-base-chart/chartDefaults';

import { BaseChartConfig } from './types';
import { ScaleType } from '../../common/constants';
import { DataType } from '../../../utils/dataConstants';
import { ViewPort } from '../../../utils/dataTypes';

export const VIEWPORT: ViewPort = {
  start: new Date(2000, 0, 0, 0),
  end: new Date(2001, 0, 0, 0),
  yMin: 0,
  yMax: 100,
};

/**
 * Shared base Chart Config for use in tests.
 */
export const CHART_CONFIG: BaseChartConfig = {
  ...DEFAULT_CHART_CONFIG,
  widgetId: 'base-chart-config',
  viewport: VIEWPORT,
  size: { width: 500, height: 500, marginLeft: 100, marginRight: 40, marginTop: 40, marginBottom: 100 },
  movement: {
    enableXScroll: true,
    enableYScroll: false,
    zoomMax: 40,
    zoomMin: 0.1,
  },
  layout: {
    xGridVisible: true,
    yGridVisible: true,
    xTicksVisible: true,
    yTicksVisible: true,
  },
  scale: {
    xScaleType: ScaleType.TimeSeries,
    yScaleType: ScaleType.Linear,
    xScaleSide: 'bottom',
    yScaleSide: 'left',
  },
  dataStreams: [
    {
      resolution: 0,
      data: [],
      id: '1',
      color: '#fff',
      name: 'fake name',
      dataType: DataType.NUMBER,
    },
    {
      resolution: 0,
      data: [],
      id: '2',
      color: '#000',
      name: 'another fake name',
      dataType: DataType.NUMBER,
    },
  ],
};
