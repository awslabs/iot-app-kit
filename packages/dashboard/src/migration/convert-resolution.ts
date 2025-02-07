import { defaultResolution } from './constants';
import { type ForeignWidgetType } from './types';
import { type Resolution } from '@iot-app-kit/source-iotsitewise';

export const convertResolution = (
  widgetType: ForeignWidgetType,
  resolution?: string | 'raw'
): Resolution => {
  if (
    widgetType === 'monitor-status-timeline' ||
    widgetType === 'monitor-table'
  ) {
    // Timeline has resolution set to 0
    return '0';
  }

  if (resolution) {
    if (resolution === 'raw') {
      return defaultResolution;
    }
    return resolution as Resolution;
  }
  return defaultResolution;
};
