import { useEffect } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { ChartRef } from '../../../hooks/useECharts';
import { datasetId } from './optionIdentifier';

const convertToDataSet = (dataStreams: DataStream[]) =>
  dataStreams.map(({ id, data }) => ({
    id: datasetId({ id }),
    source: data,
  }));

/**
 * Hook to set the data points values for each datastream on a chart
 */
export const  useChartDataset = (
  chartRef: ChartRef,
  dataStreams: DataStream[]
) => {
  useEffect(() => {
    chartRef.current?.setOption({ dataset: convertToDataSet(dataStreams) });
  }, [chartRef, dataStreams]);
};
