import { useRef } from 'react';
import { calculateTrendCursorsSeriesMakers, calculateXFromTimestamp } from '../utils/trendCursorCalculations';
import { onResizeUpdateTrendCursorYValues } from '../utils/getTrendCursor';
import { TrendCursorProps } from '../types';

const useHandleResize = ({ size, series, graphic, setGraphic, chartRef, visualization }: TrendCursorProps) => {
  const prevSize = useRef(size);
  // to avoid unnecessary re-rendering
  if (size.width !== prevSize.current.width || size.height !== prevSize.current.height) {
    const newG = graphic.map((g) => {
      // splitting into two separate if block to avoid calculations when not necessary

      // if height has changed, update Y values
      if (size.height !== prevSize.current.height) {
        // updating the series line marker's y value
        const { trendCursorsSeriesMakersInPixels } = calculateTrendCursorsSeriesMakers(
          series,
          g.timestampInMs,
          chartRef,
          visualization
        );

        // update line height and markers
        g.children = onResizeUpdateTrendCursorYValues(g.children, trendCursorsSeriesMakersInPixels, size);
      }

      // if width has changed, update X values
      if (size.width !== prevSize.current.width) {
        // updating x of the graphic
        g.x = calculateXFromTimestamp(g.timestampInMs, chartRef);
      }

      return g;
    });
    setGraphic([...newG]);
    prevSize.current = size;
  }
};

export default useHandleResize;
