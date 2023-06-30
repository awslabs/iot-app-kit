import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { EChartsType, getInstanceByDom, GraphicComponentOption } from 'echarts';
import { addNewTrendCursor } from './utils/getInfo';
import { Viewport } from '@iot-app-kit/core';
import { SizeConfig } from './types';

const useTrendCursors = (
  ref: React.RefObject<HTMLDivElement>,
  graphic: GraphicComponentOption[],
  size: SizeConfig,
  isInCursorAddMode: boolean,
  setGraphic: Dispatch<SetStateAction<GraphicComponentOption[]>>,
  viewport?: Viewport
) => {
  useEffect(() => {
    let chart: EChartsType | undefined;
    if (ref.current !== null) {
      chart = getInstanceByDom(ref.current);

      chart?.getZr().on('click', (e) => {
        if (isInCursorAddMode) {
          setGraphic([...graphic, addNewTrendCursor(e, size, viewport)]);
        }
      });

      chart?.getZr().on('mousemove', () => {
        if (isInCursorAddMode) {
          chart?.getZr().setCursorStyle('crosshair');
        } else {
          chart?.getZr().setCursorStyle('auto');
        }
      });
    }

    return () => {
      if (ref.current !== null) {
        chart?.getZr().off('click');
        // intentionally not removing the "moverover" event as shown below, this will remove the default show tooltip behaviour
        // chart?.getZr().off('mouseover');
      }
    };
  }, [ref, graphic, size, isInCursorAddMode]);
};

export default useTrendCursors;
