import { type AnomalyData } from '@iot-app-kit/component-core';
import { SORT_TRANSFORM } from '../constants';

const isEmptyDataSet = (data: AnomalyData | undefined) =>
  !data ||
  (Array.isArray(data) ? data.length === 0 : data.timestamp.length === 0);

export const convertDataset = (data?: AnomalyData) => {
  if (isEmptyDataSet(data)) return [];
  return [
    {
      source: data,
    },
    SORT_TRANSFORM,
  ];
};
