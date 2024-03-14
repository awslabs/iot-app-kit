import React from 'react';
import {
  XYPlotTooltipDatastreamLabel,
  XYPlotTooltipDatastreamLabelOptions,
} from './datastreamLabel';
import { XYPlotTooltipValue, XYPlotTooltipValueOptions } from './value';
import { ChartDataQuality } from '../../types';

export type XYPlotTooltipDatastreamOptions =
  XYPlotTooltipDatastreamLabelOptions &
    XYPlotTooltipValueOptions &
    ChartDataQuality;

export const XYPlotTooltipDatastream = ({
  name,
  color,
  quality,
  value,
  significantDigits,
  showBadDataIcons,
  showUncertainDataIcons,
}: XYPlotTooltipDatastreamOptions) => {
  return (
    <>
      <XYPlotTooltipDatastreamLabel
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
        name={name}
        quality={quality}
        color={color}
      />
      <XYPlotTooltipValue significantDigits={significantDigits} value={value} />
    </>
  );
};
