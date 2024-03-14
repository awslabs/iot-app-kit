import React from 'react';
import { XYPlotTooltipTime, XYPlotTooltipTimeOptions } from './time';
import {
  XYPlotTooltipDatastreams,
  XYPlotTooltipDatastreamsOptions,
} from './datastreams';
import { ChartDataQuality } from '../../types';

export type XYPlotTooltipOptions = XYPlotTooltipTimeOptions &
  XYPlotTooltipDatastreamsOptions &
  ChartDataQuality;
export const XYPlotTooltip = ({
  time,
  datastreams,
  showBadDataIcons,
  showUncertainDataIcons,
}: XYPlotTooltipOptions) => {
  return (
    <div role='tooltip'>
      <XYPlotTooltipTime time={time} />
      <XYPlotTooltipDatastreams
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
        datastreams={datastreams}
      />
    </div>
  );
};
