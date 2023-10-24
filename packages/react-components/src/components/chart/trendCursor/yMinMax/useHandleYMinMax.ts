import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef } from 'react';
import { InternalGraphicComponentGroupOption } from '../types';
import { YAXisOption } from 'echarts/types/dist/shared';
import { Visualization, YAxisLegendOption } from '../../types';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { ECharts, SeriesOption } from 'echarts';
import { updateTrendCursorLineMarkers } from '../getTrendCursor/components/markers';
import { delayedRender } from '../../utils/useDelayedRender';

export const useHandleYMinMax = ({
  yAxisOptions,
  graphic,
  setGraphic,
  chartRef,
  visualization,
  series,
}: {
  yAxisOptions: {
    yAxis: YAXisOption[];
    yMins: YAxisLegendOption[];
    yMaxs: YAxisLegendOption[];
  };
  graphic: InternalGraphicComponentGroupOption[];
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>;
  chartRef: MutableRefObject<ECharts | null>;
  visualization: Visualization;
  series: SeriesOption[];
}) => {
  const seriesRef = useRef(series);
  const visualizationRef = useRef(visualization);
  const graphicRef = useRef(graphic);
  const yAxisOptionsString = JSON.stringify(yAxisOptions);

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
        g.children = updateTrendCursorLineMarkers(g.children, trendCursorsSeriesMakersInPixels);
        return g;
      });

      setGraphic([...newG]);
    };
    delayedRender({ updateFunction: update });
  }, [chartRef, setGraphic, yAxisOptionsString]);
};
