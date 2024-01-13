import React, { useEffect, useRef, useState } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { LineSeriesOption, SeriesOption } from 'echarts';
import { InternalGraphicComponentGroupOption } from '../../trendCursor/types';
import { ChartLegend } from '../../types';
import { ChartLegendTable } from './table';
import { DataStreamInformation, TrendCursor } from './types';
import isEqual from 'lodash.isequal';

const mapDataStreamInformation = (
  datastreams: DataStream[],
  series: SeriesOption[],
  graphic: InternalGraphicComponentGroupOption[]
): DataStreamInformation[] =>
  datastreams.map(({ id, name }) => {
    const foundSeries = series.find((series) => series.id === id);
    const graphicIndex = series.findIndex((series) => series.id === id);
    const trendCursorValues = graphic.reduce<
      DataStreamInformation['trendCursorValues']
    >((valueMap, nextGraphic) => {
      const trendCursorId = nextGraphic.id as string;
      valueMap[trendCursorId] = nextGraphic.yAxisMarkerValue[graphicIndex];
      return valueMap;
    }, {});

    return {
      id,
      name,
      color:
        ((foundSeries as LineSeriesOption)?.lineStyle?.color as string) ?? '',
      trendCursorValues,
    };
  });

const mapTrendCursors = (
  graphic: InternalGraphicComponentGroupOption[]
): TrendCursor[] =>
  graphic.map(({ id, color, timestampInMs }) => {
    return {
      id: id as string,
      color,
      date: timestampInMs,
    };
  });

type ChartLegendTableAdapterOptions = ChartLegend & {
  datastreams: DataStream[];
  series: SeriesOption[];
  graphic: InternalGraphicComponentGroupOption[];
};

export const ChartLegendTableAdapter = ({
  datastreams,
  series,
  graphic,
  ...options
}: ChartLegendTableAdapterOptions) => {
  const [datastreamInformation, setDatastreamInformation] = useState<
    DataStreamInformation[]
  >([]);
  const [trendCursors, setTrendCursors] = useState<TrendCursor[]>([]);
  const previousDatastreamInformation = useRef(
    mapDataStreamInformation(datastreams, series, graphic)
  );
  const previousTrendCursors = useRef(mapTrendCursors(graphic));

  useEffect(() => {
    const mappedDataStreamInformation = mapDataStreamInformation(
      datastreams,
      series,
      graphic
    );
    if (
      !isEqual(
        previousDatastreamInformation.current,
        mappedDataStreamInformation
      )
    ) {
      setDatastreamInformation(mappedDataStreamInformation);
      previousDatastreamInformation.current = mappedDataStreamInformation;
    }
    const mappedTrendCursors = mapTrendCursors(graphic);
    if (!isEqual(previousTrendCursors.current, mappedTrendCursors)) {
      setTrendCursors(mappedTrendCursors);
      previousTrendCursors.current = mappedTrendCursors;
    }
  }, [datastreams, series, graphic]);

  return (
    <ChartLegendTable
      datastreams={datastreamInformation}
      trendCursors={trendCursors}
      {...options}
    />
  );
};
