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
              name: 'l4e-timeline-axis',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
            {
              name: 'l4e-selection-axis',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
            {
              name: 'l4e-line',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
          ]
        : undefined;
    return { xAxis: customXAxis };
  }, [viewportStart, viewportEnd]);
};
