import { useMemo } from 'react';

export const useXAxis = ({
  viewportStart,
  viewportEnd,
}: {
  viewportStart?: Date;
  viewportEnd?: Date;
}) => {
  return useMemo(() => {
    const customXAxis =
      viewportStart && viewportEnd
        ? [
            {
              name: 'anomaly-timeline-axis',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
            {
              name: 'anomaly-selection-axis',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
            {
              name: 'anomaly-line',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
          ]
        : undefined;
    return { xAxis: customXAxis };
  }, [viewportStart, viewportEnd]);
};
