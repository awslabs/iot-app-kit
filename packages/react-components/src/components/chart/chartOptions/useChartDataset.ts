import { useEffect } from 'react';
import { type DataStream } from '@iot-app-kit/core';
import { type ChartRef } from '../../../hooks/useECharts';

/**
 *
 * alarm datastreams are mapped in a prior hook
 */
const convertToDataSet = (dataStreams: DataStream[]) => {
  return dataStreams.map(({ data }) => {
    return {
      source: data,
    };
  });
};

/**
 * Hook to set the data points values for each datastream on a chart
 */
export const useChartDataset = (
  chartRef: ChartRef,
  dataStreams: DataStream[]
) => {
  useEffect(() => {
    chartRef.current?.setOption({
      dataset: convertToDataSet(dataStreams),
    });
  }, [chartRef, dataStreams]);
};
