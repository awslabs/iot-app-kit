import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { EChartsType, getInstanceByDom } from 'echarts';
import { addNewTrendCursor } from './utils/getInfo';
import { Viewport } from '@iot-app-kit/core';
import { InternalGraphicComponentGroupOption, SizeConfig } from './types';
import { MAX_TREND_CURSORS } from './eChartsConstants';

const useTrendCursors = (
  ref: React.RefObject<HTMLDivElement>,
  graphic: InternalGraphicComponentGroupOption[],
  size: SizeConfig,
  isInCursorAddMode: boolean,
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
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
  useEffect(() => {
    let chart: EChartsType | undefined;
    if (ref.current !== null) {
      chart = getInstanceByDom(ref.current);

      chart?.getZr().on('click', (e) => {
        if (isInCursorAddMode && graphic.length < MAX_TREND_CURSORS) {
          setGraphic(addNewTrendCursor(e, size, graphic.length, graphic, setGraphic, viewport, chart));
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
  }, [ref, graphic, size, isInCursorAddMode, setGraphic, viewport, theme]);

  useEffect(() => {
    console.log(graphic);
  }, [graphic]);
};

export default useTrendCursors;
