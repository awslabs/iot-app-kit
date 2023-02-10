import React from 'react';
import { Sparklines, SparklinesLine } from `react-sparklines`;
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData'
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest, Viewport } from '@iot-app-kit/core';

const SparkLine = ({ query, viewport }: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport: Viewport;
}) => {

  const { dataStreams } = useTimeSeriesData({
    query,
    viewport,
  });


  // Transform the IoT App Kit time series data into a format
  // react-sparkline expects, which is a single array of y values
  const data = dataStreams[0]?.data.map(({ y }) => y) || [];

  return (
    <Sparklines data={data}>
      <SparklinesLine color="black" />
    </Sparklines>
  );
}
