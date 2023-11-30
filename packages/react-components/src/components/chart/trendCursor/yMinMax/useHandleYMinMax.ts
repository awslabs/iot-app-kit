import { useEffect, useRef } from 'react';
import { handleChangeProps } from '../types';
import { YAXisOption } from 'echarts/types/dist/shared';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { updateTrendCursorLineMarkers } from '../getTrendCursor/components/markers';
import { delayedRender } from '../../utils/useDelayedRender';

export const useHandleYMinMax = ({
  yAxisOptions,
  graphic,
  setGraphic,
  chartRef,
  visualization,
  series,
  significantDigits,
}: handleChangeProps & {
  yAxisOptions: {
    yAxis: YAXisOption[];
  };
}) => {
  const seriesRef = useRef(series);
  const visualizationRef = useRef(visualization);
  const graphicRef = useRef(graphic);
  const significantDigitsRef = useRef(significantDigits);
  const yAxisOptionsString = JSON.stringify(yAxisOptions);

  useEffect(() => {
    graphicRef.current = graphic;
    visualizationRef.current = visualization;
    seriesRef.current = series;
    significantDigitsRef.current = significantDigits;
  }, [graphic, visualization, series, significantDigits]);

  useEffect(() => {
    const update = () => {
      const newG = graphicRef.current.map((g) => {
        const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } = calculateSeriesMakers(
          seriesRef.current,
          g.timestampInMs,
          chartRef,
          visualizationRef.current,
          significantDigitsRef.current
        );
        g.yAxisMarkerValue = trendCursorsSeriesMakersValue;
        g.children = updateTrendCursorLineMarkers(g.children, trendCursorsSeriesMakersInPixels);
        return g;
      });

      setGraphic([...newG]);
    };
    delayedRender({ updateFunction: update });
  }, [chartRef, setGraphic, yAxisOptionsString]);
};
