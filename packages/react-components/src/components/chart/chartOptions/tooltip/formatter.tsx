import React from 'react';
import { renderToString } from 'react-dom/server';
import { DataPoint } from '@iot-app-kit/core';
import {
  TooltipFormatterCallback,
  TopLevelFormatterParams,
} from 'echarts/types/dist/shared';
import { XYPlotTooltip } from './tooltip';
import { ChartDataQuality } from '../../types';

type FormatterOptions = {
  significantDigits?: number;
  colorMap: { [key in string]: string };
} & ChartDataQuality;
export const formatter =
  ({
    significantDigits,
    colorMap = {},
    showBadDataIcons,
    showUncertainDataIcons,
  }: FormatterOptions): TooltipFormatterCallback<TopLevelFormatterParams> =>
  (params) => {
    const normalizedParams = Array.isArray(params) ? params : [params];

    const time = (normalizedParams.at(0)?.data as DataPoint | undefined)?.x;

    const datastreams = normalizedParams.map((param) => {
      const dataPoint = param.data as DataPoint | undefined;
      const id = param.seriesId ?? '';
      const color = colorMap[id];
      const value = dataPoint?.y;
      const name = param.seriesName;
      const quality = dataPoint?.quality;

      return {
        color,
        name,
        value,
        significantDigits,
        quality,
        id,
      };
    });

    return renderToString(
      <XYPlotTooltip
        time={time}
        datastreams={datastreams}
        showBadDataIcons={showBadDataIcons}
        showUncertainDataIcons={showUncertainDataIcons}
      />
    );
  };
