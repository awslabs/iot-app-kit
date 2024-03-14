import React from 'react';
import { spaceScaledXxs } from '@cloudscape-design/design-tokens';

import {
  XYPlotTooltipDatastreamName,
  XYPlotTooltipDatastreamNameOptions,
} from './name';
import {
  XYPlotTooltipDatastreamColor,
  XYPlotTooltipDatastreamColorOptions,
} from './color';
import { ChartDataQuality } from '../../types';

export type XYPlotTooltipDatastreamLabelOptions =
  XYPlotTooltipDatastreamNameOptions &
    XYPlotTooltipDatastreamColorOptions &
    ChartDataQuality;

export const XYPlotTooltipDatastreamLabel = ({
  color,
  name,
  quality,
  showBadDataIcons,
  showUncertainDataIcons,
}: XYPlotTooltipDatastreamLabelOptions) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: spaceScaledXxs,
      }}
    >
      <XYPlotTooltipDatastreamColor color={color} />
      <XYPlotTooltipDatastreamName
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
        name={name}
        quality={quality}
      />
    </div>
  );
};
