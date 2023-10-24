import { Visualization } from '../../types';
import { InternalGraphicComponentGroupOption } from '../types';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef } from 'react';
import { ECharts, SeriesOption } from 'echarts';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { upsertTrendCursorLineMarkers } from '../getTrendCursor/components/markers';
import { delayedRender } from '../../utils/useDelayedRender';

export const useHandleSeries = ({
  graphic,
  setGraphic,
  chartRef,
  visualization,
  series,
}: {
  graphic: InternalGraphicComponentGroupOption[];
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>;
  chartRef: MutableRefObject<ECharts | null>;
  visualization: Visualization;
  series: SeriesOption[];
}) => {
  const seriesRef = useRef(series);
  const visualizationRef = useRef(visualization);
  const graphicRef = useRef(graphic);

  useEffect(() => {
    graphicRef.current = graphic;
    visualizationRef.current = visualization;
    seriesRef.current = series;
  }, [graphic, visualization, series]);

  useEffect(() => {
    const update = () => {
      const newG = graphicRef.current.map((g) => {
        const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } = calculateSeriesMakers(
          seriesRef.current,
          g.timestampInMs,
          chartRef,
          visualizationRef.current
        );

        g.yAxisMarkerValue = trendCursorsSeriesMakersValue;
        g.children = upsertTrendCursorLineMarkers(g.children, trendCursorsSeriesMakersInPixels, seriesRef.current);
        return g;
      });

      setGraphic([...newG]);
    };

    delayedRender({ updateFunction: update });
  }, [chartRef, series.length, setGraphic]);
};
