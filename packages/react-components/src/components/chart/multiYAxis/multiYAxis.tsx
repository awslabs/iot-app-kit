import React from 'react';

import { spaceScaledXs } from '@cloudscape-design/design-tokens';

import { YAxisLegend } from './yAxisMenu';
import { DEFAULT_MARGIN, MULTI_Y_AXIS_LEGEND_WIDTH } from '../eChartsConstants';
import { YAxisLegendOption } from '../types';

import './multiYAxis.css';

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
  const marginHeight = DEFAULT_MARGIN * 2;
  const maxHeight = (height - marginHeight) / 2;
  return (
    <div
      className='multi-y-axis-legend'
      style={{
        width: MULTI_Y_AXIS_LEGEND_WIDTH,
        paddingLeft: spaceScaledXs,
        paddingTop: DEFAULT_MARGIN,
        paddingBottom: DEFAULT_MARGIN,
      }}
    >
      <YAxisLegend maxHeight={maxHeight} label='Y-Max' axes={yMax} />
      <YAxisLegend maxHeight={maxHeight} label='Y-Min' axes={yMin} menuPosition='top' />
    </div>
  );
};
