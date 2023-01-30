import { BaseChartConfig, ThresholdOptions } from '../common/types';
import { LEGEND_POSITION, ScaleType } from '../../common/constants';
import { BaseConfig } from '../../../utils/dataTypes';

export const DEFAULT_BASE_CONFIG: BaseConfig = {
  widgetId: 'fake-id',
  viewport: {
    start: new Date(1995, 0, 0, 0),
    end: new Date(2020, 1, 0, 0),
    yMin: 0,
    yMax: 10000,
  },
  // width is width - marginLeft - marginRight
  size: { width: 400 + 50 + 40, height: 350, marginLeft: 50, marginRight: 50, marginTop: 8, marginBottom: 30 },
};

export const DEFAULT_CHART_CONFIG: BaseChartConfig = {
  widgetId: 'fake-id',
  viewport: {
    start: new Date(1995, 0, 0, 0),
    end: new Date(2020, 1, 0, 0),
    yMin: 0,
    yMax: 10000,
  },
  // width is width - marginLeft - marginRight
  size: { width: 400 + 50 + 25, height: 350, marginLeft: 50, marginRight: 50, marginTop: 24, marginBottom: 30 },
  movement: {
    enableXScroll: true,
    enableYScroll: false,
    zoomMax: Infinity,
    zoomMin: 0.00001,
  },
  layout: {
    xGridVisible: false,
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
  dataStreams: [],
  legend: {
    position: LEGEND_POSITION.BOTTOM,
    width: 170,
  },
};

export const DEFAULT_THRESHOLD_OPTIONS: ThresholdOptions = {
  showColor: true,
};

export const DEFAULT_THRESHOLD_OPTIONS_OFF: ThresholdOptions = {
  showColor: false,
};
