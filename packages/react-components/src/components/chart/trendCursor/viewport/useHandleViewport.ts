import { SizeConfig, ViewportInMs } from '../../types';
import { useRef } from 'react';
import { calculateXFromTimestamp } from '../calculations/calculations';
import { DEFAULT_MARGIN } from '../../eChartsConstants';
import { handleChangeProps } from '../types';

import { updateTrendCursorLineMarkers } from '../getTrendCursor/components/markers';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { delayedRender } from '../../utils/useDelayedRender';

interface handleViewportProps extends handleChangeProps {
  viewportInMs: ViewportInMs;
  size: SizeConfig;
}
export const useHandleViewport = ({
  graphic,
  setGraphic,
  viewportInMs,
  series,
  chartRef,
  visualization,
  size,
  significantDigits,
}: handleViewportProps) => {
  const xAxisViewportInMsMinRef = useRef(viewportInMs.initial);
  const xAxisViewportInMsMaxRef = useRef(viewportInMs.end);

  if (
    viewportInMs.end !== xAxisViewportInMsMaxRef.current ||
    viewportInMs.initial !== xAxisViewportInMsMinRef.current
  ) {
    const update = () => {
      const newG = graphic.map((g) => {
        // disabled during dragging, transition will be an empty array when user is dragging

        const x = calculateXFromTimestamp(g.timestampInMs, chartRef);

        if (x < DEFAULT_MARGIN || x > size.width - DEFAULT_MARGIN) {
          // hiding the TC when it's beyond the viewport
          g.ignore = true;
        } else {
          g.ignore = false;

          const {
            trendCursorsSeriesMakersValue,
            trendCursorsSeriesMakersInPixels,
          } = calculateSeriesMakers(
            series,
            g.timestampInMs,
            chartRef,
            visualization,
            significantDigits
          );
          g.yAxisMarkerValue = trendCursorsSeriesMakersValue;
          g.children = updateTrendCursorLineMarkers(
            g.children,
            trendCursorsSeriesMakersInPixels
          );

          // update the X in any case
          g.x = x;
        }
        return g;
      });
      setGraphic(newG);
    };

    delayedRender({ updateFunction: update });
  }

  xAxisViewportInMsMinRef.current = viewportInMs.initial;
  xAxisViewportInMsMaxRef.current = viewportInMs.end;
};
