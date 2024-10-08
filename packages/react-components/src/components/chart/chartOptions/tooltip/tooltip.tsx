import React from 'react';
import { XYPlotTooltipTime, XYPlotTooltipTimeOptions } from './time';
import {
  XYPlotTooltipDatastreams,
  XYPlotTooltipDatastreamsOptions,
} from './datastreams';
import { ChartAlarms, ChartDataQuality } from '../../types';

export type XYPlotTooltipOptions = XYPlotTooltipTimeOptions &
  XYPlotTooltipDatastreamsOptions &
  ChartDataQuality &
  ChartAlarms;
export const XYPlotTooltip = ({
  time,
  datastreams,
  showBadDataIcons,
  showUncertainDataIcons,
  showAlarmIcons,
}: XYPlotTooltipOptions) => {
  return (
    <div role='tooltip'>
      <XYPlotTooltipTime time={time} />
      <XYPlotTooltipDatastreams
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
        showAlarmIcons={showAlarmIcons}
        datastreams={datastreams}
      />
    </div>
  );
};
