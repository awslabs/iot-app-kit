import React from 'react';

// import { spaceScaledS } from '@cloudscape-design/design-tokens';

import { YAxisLegend } from './yAxisMenu';
import { MULTI_Y_AXIS_LEGEND_WIDTH } from '../eChartsConstants';

import './multiYAxis.css';
import { YAxisLegendOption } from '../types';

type MultiYAxisLegendOptions = {
  height: number;
  yMax: YAxisLegendOption[];
  yMin: YAxisLegendOption[];
};
/**
 *
 * @param { height, yMin, yMax }
 *  height: chart height (used to determine the max height of the legend menu)
 *  yMin: list of YAxisLegendOption for the min values of a datastream with a custom yAxis
 *  yMax: list of YAxisLegendOption for the max values of a datastream with a custom yAxis
 */
export const MultiYAxisLegend = ({ height, yMax, yMin }: MultiYAxisLegendOptions) => {
  const maxHeight = height / 2;
  return (
    <div className='multi-y-axis-legend' style={{ width: MULTI_Y_AXIS_LEGEND_WIDTH }}>
      <YAxisLegend maxHeight={maxHeight} label='Y-Min' axes={yMin} />
      <YAxisLegend maxHeight={maxHeight} label='Y-Max' axes={yMax} menuPosition='top' />
    </div>
  );
};
