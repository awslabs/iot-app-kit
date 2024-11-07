import { spaceScaledXs } from '@cloudscape-design/design-tokens';

import { type DataStream } from '@iot-app-kit/core';

import { YAxisLegend } from './yAxisMenu';
import { DEFAULT_MARGIN, MULTI_Y_AXIS_LEGEND_WIDTH } from '../eChartsConstants';
import { useCustomYAxis } from './useCustomYAxis';

import './multiYAxis.css';

type MultiYAxisLegendOptions = {
  height: number;
  datastreams: DataStream[];
};
/**
 *
 * @param { height, yMin, yMax }
 *  height: chart height (used to determine the max height of the legend menu)
 *  yMin: list of YAxisLegendOption for the min values of a datastream with a custom yAxis
 *  yMax: list of YAxisLegendOption for the max values of a datastream with a custom yAxis
 */
export const MultiYAxisLegend = ({
  height,
  datastreams,
}: MultiYAxisLegendOptions) => {
  const { yMax, yMin } = useCustomYAxis(datastreams);

  const marginHeight = DEFAULT_MARGIN * 2;
  const maxHeight = (height - marginHeight) / 2;

  if (yMax.length === 0 || yMin.length === 0) return null;
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
      <YAxisLegend
        maxHeight={maxHeight}
        label='Y-Min'
        axes={yMin}
        menuPosition='top'
      />
    </div>
  );
};
