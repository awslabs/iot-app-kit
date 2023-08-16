import { InternalGraphicComponentGroupOption, SizeConfig, ViewportInMs } from '../types';
import { Dispatch, SetStateAction, useRef } from 'react';
import { calculateXFromTimestamp } from './getInfo';
import { DEFAULT_MARGIN } from '../eChartsConstants';

interface handleViewportProps {
  graphic: InternalGraphicComponentGroupOption[];
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>;
  viewportInMs: ViewportInMs;
  size: SizeConfig;
}
export const handleViewport = ({ graphic, setGraphic, size, viewportInMs }: handleViewportProps) => {
  const xAxisViewportInMsMinRef = useRef(viewportInMs.initial);
  const xAxisViewportInMsMaxRef = useRef(viewportInMs.end);

  if (
    viewportInMs.end !== xAxisViewportInMsMaxRef.current ||
    viewportInMs.initial !== xAxisViewportInMsMinRef.current
  ) {
    const newG = graphic.map((g) => {
      // disabled during dragging, transition will be an empty array when user is dragging

      const x = calculateXFromTimestamp(g.timestampInMs, size, viewportInMs);
      if (x < DEFAULT_MARGIN) {
        // hiding the TC
        g.ignore = true;
      } else {
        g.x = x;
      }
      return g;
    });

    setGraphic(newG);
  }
  xAxisViewportInMsMinRef.current = viewportInMs.initial;
  xAxisViewportInMsMaxRef.current = viewportInMs.end;
};
