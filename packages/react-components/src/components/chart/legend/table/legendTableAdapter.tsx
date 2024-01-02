import React from 'react';
import { DataStream } from '@iot-app-kit/core';
import { ChartLegend } from '../../types';
import { ChartLegendTable } from './table';
import { DataStreamInformation, TrendCursor } from './types';
import { TrendCursorValues } from '../../../../echarts/extensions/trendCursors/store';

const mapDataStreamInformation = ({
  datastreams,
  trendCursorValues,
  chartId,
  visibleContent,
}: {
  datastreams: Pick<DataStream, 'id' | 'color' | 'name' | 'unit'>[];
  trendCursorValues: TrendCursorValues[];
  chartId: string;
  visibleContent: ChartLegend['visibleContent'];
}): DataStreamInformation[] =>
  datastreams.map(({ id, name, color, unit }) => {
    const values = trendCursorValues.reduce<
      DataStreamInformation['trendCursorValues']
    >((valueMap, next) => {
      const valueId = chartId + id;
      const value = next[valueId];
      if (!value) return valueMap;
      valueMap[value.trendCursorId] = value.value;
      return valueMap;
    }, {});

    const dataStreamName = visibleContent?.unit ? `${name} (${unit})` : name;

    return {
      id,
      name: dataStreamName,
      color,
      trendCursorValues: values,
    };
  });

type ChartLegendTableAdapterOptions = ChartLegend & {
  datastreams: Pick<DataStream, 'id' | 'color' | 'name'>[];
  trendCursorValues: TrendCursorValues[];
  trendCursors: TrendCursor[];
  chartId?: string;
};

export const ChartLegendTableAdapter = ({
  datastreams,
  trendCursors,
  trendCursorValues,
  chartId = '',
  visibleContent,
  ...options
}: ChartLegendTableAdapterOptions) => {
  const datastreamItems = mapDataStreamInformation({
    datastreams,
    trendCursorValues,
    chartId,
    visibleContent,
  });

  return (
    <ChartLegendTable
      datastreams={datastreamItems}
      trendCursors={trendCursors}
      {...options}
    />
  );
};
