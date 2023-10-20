import { SizeConfig, ViewportInMs, Visualization } from '../../types';
import { Dispatch, MutableRefObject, SetStateAction, useRef } from 'react';
import { calculateXFromTimestamp } from '../calculations/calculations';
import { DEFAULT_MARGIN } from '../../eChartsConstants';
import { ECharts, SeriesOption } from 'echarts';
import { InternalGraphicComponentGroupOption } from '../types';

import { updateTrendCursorLineMarkers } from '../getTrendCursor/components/markers';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';

interface handleViewportProps {
  graphic: InternalGraphicComponentGroupOption[];
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>;
  viewportInMs: ViewportInMs;
  size: SizeConfig;
  series: SeriesOption[];
  chartRef: MutableRefObject<ECharts | null>;
  visualization: Visualization;
}
export const useHandleViewport = ({
  graphic,
  setGraphic,
  viewportInMs,
  series,
  chartRef,
  visualization,
  size,
}: handleViewportProps) => {
  const xAxisViewportInMsMinRef = useRef(viewportInMs.initial);
  const xAxisViewportInMsMaxRef = useRef(viewportInMs.end);

  if (
    viewportInMs.end !== xAxisViewportInMsMaxRef.current ||
    viewportInMs.initial !== xAxisViewportInMsMinRef.current
  ) {
    const newG = graphic.map((g) => {
      // disabled during dragging, transition will be an empty array when user is dragging

      const x = calculateXFromTimestamp(g.timestampInMs, chartRef);

      if (x < DEFAULT_MARGIN || x > size.width - DEFAULT_MARGIN) {
        // hiding the TC when it's beyond the viewport
        g.ignore = true;
      } else {
        g.ignore = false;
        // update the markers because the y value may scale as the input value changes
        if (viewportInMs.isDurationViewport) {
          const { trendCursorsSeriesMakersValue, trendCursorsSeriesMakersInPixels } = calculateSeriesMakers(
            series,
            g.timestampInMs,
            chartRef,
            visualization
          );
          g.yAxisMarkerValue = trendCursorsSeriesMakersValue;
          g.children = updateTrendCursorLineMarkers(g.children, trendCursorsSeriesMakersInPixels);
        }

        // update the X in any case
        g.x = x;
      }
      return g;
    });

    setGraphic(newG);
  }
  xAxisViewportInMsMinRef.current = viewportInMs.initial;
  xAxisViewportInMsMaxRef.current = viewportInMs.end;
};
