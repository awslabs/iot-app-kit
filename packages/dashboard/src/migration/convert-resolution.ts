import { defaultResolution } from './constants';
import { MonitorWidgetType, type SiteWiseWidgetType } from './types';

export const convertResolution = (
  widgetType: MonitorWidgetType | SiteWiseWidgetType,
  resolution?: string
) => {
  if (
    widgetType === MonitorWidgetType.StatusTimeline ||
    widgetType === MonitorWidgetType.Table
  ) {
    // Timeline has resolution set to 0
    return '0';
  }

  if (resolution) {
    if (resolution === 'raw') {
      return defaultResolution;
    }
    return resolution;
  }
  return defaultResolution;
};
