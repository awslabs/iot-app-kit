import type { Aggregation } from '~/features/widget-customization/common/aggregation/aggregation-field';
import type { Resolution } from '@iot-app-kit/source-iotsitewise';

export const BAR_CHART_WIDGET_TYPE = 'bar-chart';
export const WIDGET_INITIAL_HEIGHT = 400;
export const WIDGET_INITIAL_WIDTH = 650;

export const DEFAULT_AGGREGATION = 'AVERAGE' satisfies Aggregation;
export const DEFAULT_RESOLUTION = '1m' satisfies Resolution;
