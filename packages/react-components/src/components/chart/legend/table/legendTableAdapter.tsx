import React from 'react';
import { DataStream, Primitive } from '@iot-app-kit/core';
import { ChartLegend, ChartOptions } from '../../types';
import { ChartLegendTable } from './table';
import { DataStreamInformation, TrendCursor } from './types';
import { TrendCursorValues } from '../../../../echarts/extensions/trendCursors/store';

const mapDataStreamInformation = ({
  datastreams,
  trendCursorValues,
  chartId,
  visibleContent,
}: {
  datastreams: (Pick<DataStream, 'id' | 'color' | 'name' | 'unit'> & {
    latestValue: Primitive | undefined;
  })[];
  trendCursorValues: TrendCursorValues[];
  chartId: string;
  visibleContent: ChartLegend['visibleContent'];
}): DataStreamInformation[] =>
  datastreams.map(({ id, name, color, unit, latestValue }) => {
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
      latestValue,
      trendCursorValues: values,
    };
  });

type ChartLegendTableAdapterOptions = ChartLegend & {
  datastreams: (Pick<DataStream, 'id' | 'color' | 'name' | 'unit'> & {
    latestValue: Primitive | undefined;
  })[];
  trendCursorValues: TrendCursorValues[];
  trendCursors: TrendCursor[];
  chartId?: string;
  significantDigits: ChartOptions['significantDigits'];
};

export const ChartLegendTableAdapter = ({
  datastreams,
  trendCursors,
  trendCursorValues,
  chartId = '',
  visibleContent,
  significantDigits,
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
      visibleContent={visibleContent}
      significantDigits={significantDigits}
      {...options}
    />
  );
};
