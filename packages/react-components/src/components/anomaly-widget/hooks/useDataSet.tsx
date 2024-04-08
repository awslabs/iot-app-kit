import { useMemo } from 'react';
import { AnomalyData } from '../../../data';
import { barHeight, barHeightEncoding } from '../constants';

const datasetFromData = (data: AnomalyData) => {
  if (Array.isArray(data)) {
    return data.map((d) => ({
      ...d,
      [barHeightEncoding]: barHeight,
    }));
  }
  return {
    ...data,
    [barHeightEncoding]: data.timestamp.map(() => barHeight),
  };
};

export const useDataSet = ({ data }: { data: AnomalyData | undefined }) => {
  return useMemo(() => {
    if (!data) return;
    return {
      dataset: [
        {
          source: datasetFromData(data),
        },
        {
          // Transform using echarts so we don't need to care
          // about the format of the data
          transform: [
            {
              type: 'sort',
              config: { dimension: 'timestamp', order: 'asc' },
            },
          ],
        },
      ],
    };
  }, [data]);
};
