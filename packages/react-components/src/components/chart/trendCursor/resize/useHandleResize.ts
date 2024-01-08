import { calculateXFromTimestamp } from '../calculations/calculations';

import { TrendCursorProps } from '../types';
import { onResizeUpdateTrendCursorYValues } from './updateYValues';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { useEffect, useRef } from 'react';
import { delayedRender } from '../../utils/useDelayedRender';

const useHandleResize = ({
  size,
  series,
  graphic,
  setGraphic,
  chartRef,
  visualization,
  significantDigits,
}: TrendCursorProps) => {
  const graphicRef = useRef(graphic);
  const seriesRef = useRef(series);
  const sizeRef = useRef(size);
  const visualizationRef = useRef(visualization);
  const significantDigitsRef = useRef(significantDigits);
  const sizeString = JSON.stringify(size);

  useEffect(() => {
    graphicRef.current = graphic;
    seriesRef.current = series;
    sizeRef.current = size;
    visualizationRef.current = visualization;
    significantDigitsRef.current = significantDigits;
  }, [graphic, series, significantDigits, size, visualization]);

  useEffect(() => {
    const update = () => {
      const newG = graphicRef.current.map((g) => {
        // updating the series line marker's y value
        const {
          trendCursorsSeriesMakersInPixels,
          trendCursorsSeriesMakersValue,
        } = calculateSeriesMakers(
          seriesRef.current,
          g.timestampInMs,
          chartRef,
          visualizationRef.current,
          significantDigitsRef.current
        );
        g.yAxisMarkerValue = trendCursorsSeriesMakersValue;
        // update line height and markers
        g.children = onResizeUpdateTrendCursorYValues(
          g.children,
          trendCursorsSeriesMakersInPixels,
          sizeRef.current
        );
        // updating x of the graphic
        g.x = calculateXFromTimestamp(g.timestampInMs, chartRef);
        return g;
      });

      setGraphic([...newG]);
    };
    delayedRender({ updateFunction: update });
  }, [chartRef, setGraphic, sizeString]);
};

export default useHandleResize;
