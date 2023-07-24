import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { EChartsType, getInstanceByDom, SeriesOption } from 'echarts';
import addNewTrendCursor, { onResizeUpdateTrendCursorYValues } from './addTrendCursor';
import { Viewport } from '@iot-app-kit/core';
import { InternalGraphicComponentGroupOption, SizeConfig } from './types';
import { MAX_TREND_CURSORS } from './eChartsConstants';
import { calculateNewX, calculateTrendCursorsSeriesMakers } from './utils/getInfo';

let trendCursorStaticIndex = 0;
const useTrendCursors = (
  ref: React.RefObject<HTMLDivElement>,
  graphic: InternalGraphicComponentGroupOption[],
  size: SizeConfig,
  isInCursorAddMode: boolean,
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
  series: SeriesOption[],
  yMax: number,
  yMin: number,
  viewport?: Viewport,
  theme?: string
) => {
  const mouseoverHandler = (isInCursorAddMode: boolean, chart?: EChartsType) => {
    if (isInCursorAddMode) {
      chart?.getZr().setCursorStyle('crosshair');
    } else {
      chart?.getZr().setCursorStyle('auto');
    }
  };

  const prevSize = useRef(size);
  useEffect(() => {
    let chart: EChartsType | undefined;
    if (ref.current !== null) {
      chart = getInstanceByDom(ref.current);

      chart?.getZr().on('click', (e) => {
        if (isInCursorAddMode && graphic.length < MAX_TREND_CURSORS) {
          setGraphic(
            addNewTrendCursor(
              e,
              size,
              trendCursorStaticIndex++,
              graphic,
              setGraphic,
              series,
              yMin,
              yMax,
              viewport,
              chart
            )
          );
        }
      });

      chart?.getZr().on('mousemove', () => mouseoverHandler(isInCursorAddMode, chart));
    }

    return () => {
      if (ref.current !== null) {
        chart?.getZr().off('click');
        chart?.getZr().off('mouseover', () => mouseoverHandler(isInCursorAddMode, chart));
      }
    };
  }, [ref, graphic, size, isInCursorAddMode, setGraphic, viewport, theme, series, yMin, yMax]);

  useEffect(() => {
    // to avoid unnecessary re-rendering
    if (size.width !== prevSize.current.width || size.height !== prevSize.current.height) {
      const newG = graphic.map((g) => {
        // splitting into two separate if block to avoid calculations when not necessary

        // if height has changed, update Y values
        if (size.height !== prevSize.current.height) {
          // updating the series line marker's y value
          const { trendCursorsSeriesMakersInPixels } = calculateTrendCursorsSeriesMakers(
            series,
            yMin,
            yMax,
            g.timestampInMs,
            size.height
          );

          g.children = onResizeUpdateTrendCursorYValues(g.children, trendCursorsSeriesMakersInPixels, size);
        }

        // if width has changed, update X values
        if (size.width !== prevSize.current.width) {
          // updating x of the graphic
          g.x = calculateNewX(g.timestampInMs, size, viewport);
        }

        return g;
      });
      setGraphic([...newG]);
    }
    prevSize.current = size;
  }, [size, series, yMin, yMax, graphic, setGraphic]);
};

export default useTrendCursors;
