import { handleChangeProps } from '../types';
import { useEffect, useRef } from 'react';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { updateTrendCursorLineMarkers } from '../getTrendCursor/components/markers';

export const useHandleChartOptions = ({
  graphic,
  setGraphic,
  chartRef,
  series,
  ...options
}: handleChangeProps) => {
  const graphicRef = useRef(graphic);
  const optionsRef = useRef(options);
  const seriesRef = useRef(series);

  const optionsString = JSON.stringify(options);
  useEffect(() => {
    graphicRef.current = graphic;
    optionsRef.current = options;
    seriesRef.current = series;
  }, [graphic, options, series]);

  useEffect(() => {
    const newG = graphicRef.current.map((g) => {
      const {
        trendCursorsSeriesMakersValue,
        trendCursorsSeriesMakersInPixels,
      } = calculateSeriesMakers(
        seriesRef.current,
        g.timestampInMs,
        chartRef,
        optionsRef.current.visualization,
        optionsRef.current.significantDigits
      );
      g.yAxisMarkerValue = trendCursorsSeriesMakersValue;
      g.children = updateTrendCursorLineMarkers(
        g.children,
        trendCursorsSeriesMakersInPixels
      );
      return g;
    });

    setGraphic([...newG]);
  }, [setGraphic, optionsString, chartRef]);
};
