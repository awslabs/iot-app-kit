import React from 'react';
import { useECharts } from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './useVisualizedDataStreams';
import { convertOptions } from './converters/convertOptions';

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const Chart = ({ viewport, queries, size, ...options }: ChartOptions) => {
  const { hasError, isLoading, dataStreams } = useVisualizedDataStreams(queries, viewport);

  const option = convertOptions(
    {
      dataStreams,
      hasError,
      isLoading,
    },
    {
      viewport,
      queries,
      size,
      ...options,
    }
  );

  const { ref } = useECharts({
    option,
    loading: isLoading,
    size,
  });

  return <div ref={ref} />;
};

export default Chart;
