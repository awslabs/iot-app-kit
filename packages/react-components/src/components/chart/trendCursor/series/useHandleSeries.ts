import { handleChangeProps } from '../types';
import { useEffect, useRef } from 'react';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { upsertTrendCursorLineMarkers } from '../getTrendCursor/components/markers';
import { delayedRender } from '../../utils/useDelayedRender';
import { LineSeriesOption } from 'echarts';

export const useHandleSeries = ({
  graphic,
  setGraphic,
  chartRef,
  visualization,
  series,
  significantDigits,
}: handleChangeProps) => {
  const seriesRef = useRef(series);
  const visualizationRef = useRef(visualization);
  const graphicRef = useRef(graphic);
  const significantDigitsRef = useRef(significantDigits);
  const hiddenSeriesCount = series.filter(
    (s) => (s as LineSeriesOption).lineStyle?.opacity === 0
  ).length;

  useEffect(() => {
    graphicRef.current = graphic;
    visualizationRef.current = visualization;
    seriesRef.current = series;
    significantDigitsRef.current = significantDigits;
  }, [graphic, visualization, series, significantDigits]);

  useEffect(() => {
    const update = () => {
      const newG = graphicRef.current.map((g) => {
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
        g.children = upsertTrendCursorLineMarkers(
          g.children,
          trendCursorsSeriesMakersInPixels,
          seriesRef.current
        );
        return g;
      });

      setGraphic([...newG]);
    };

    delayedRender({ updateFunction: update });
  }, [chartRef, series.length, hiddenSeriesCount, setGraphic]);
};
