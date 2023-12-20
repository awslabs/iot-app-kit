import { Viewport } from '@iot-app-kit/core';
import { DataZoomComponentOption, EChartsType } from 'echarts';
import { MutableRefObject, useEffect, useReducer } from 'react';
import { useViewport } from '../../../hooks/useViewport';
import { ECHARTS_GESTURE } from '../../../common/constants';
import { DEFAULT_DATA_ZOOM, LIVE_MODE_REFRESH_RATE_MS } from '../eChartsConstants';
import { convertViewportToMs } from '../trendCursor/calculations/viewport';

type ValidOption = {
  startValue: number;
  endValue: number;
};
const isValidZoomOption = (option: DataZoomComponentOption | undefined): option is ValidOption =>
  option != null &&
  option.startValue != null &&
  option.endValue != null &&
  typeof option.startValue === 'number' &&
  typeof option.endValue === 'number';

type ViewportMode = 'live' | 'static';
const getViewportMode = (convertedViewport: ReturnType<typeof convertViewportToMs>): ViewportMode =>
  convertedViewport.isDurationViewport ? 'live' : 'static';

type TickState = {
  mode: ViewportMode;
  viewport: Viewport | undefined;
  convertedViewport: ReturnType<typeof convertViewportToMs>;
};
type TickAction = { type: 'tick' } | { type: 'syncViewport'; payload: Viewport | undefined };
const stateFromViewport = (viewport: Viewport | undefined) => {
  const convertedViewport = convertViewportToMs(viewport);
  return {
    mode: getViewportMode(convertedViewport),
    convertedViewport,
    viewport,
  };
};
const reducer = (state: TickState, action: TickAction): TickState => {
  if (action.type === 'tick') {
    return {
      ...state,
      mode: 'live',
      convertedViewport: convertViewportToMs(state.viewport),
    };
  } else if (action.type === 'syncViewport') {
    return stateFromViewport(action.payload);
  }
  return state;
};

export const useDataZoom = (chartRef: MutableRefObject<EChartsType | null>, viewport: Viewport | undefined) => {
  const { setViewport, lastUpdatedBy } = useViewport();
  const [{ mode, convertedViewport }, dispatch] = useReducer(reducer, stateFromViewport(viewport));

  /**
   * mode will be used to start the tick interval again
   * once the user sets the viewport back to relative
   * we also need to update the viewport incase the user
   * sets it from the chart prop or viewport picker
   */
  useEffect(() => {
    dispatch({ type: 'syncViewport', payload: viewport });
  }, [viewport]);

  useEffect(() => {
    const chart = chartRef.current;
    let frame: number;
    let interval: NodeJS.Timer;

    /**
     * Sync the viewport of the chart from manual data zoom gestures
     * to the viewport context
     */
    const handleZoom = () => {
      // clear the viewport tick interval
      clearInterval(interval);

      if (!chart) return;

      // Synchronize animation with refresh rate
      frame = requestAnimationFrame(() => {
        // there should only be 1 datazoom option for the x axis
        const dataZoomOptions = chart.getOption().dataZoom as DataZoomComponentOption[];
        const horizontalZoom = dataZoomOptions.at(0);
        if (!isValidZoomOption(horizontalZoom)) return;
        setViewport(
          { start: new Date(horizontalZoom.startValue), end: new Date(horizontalZoom.endValue) },
          ECHARTS_GESTURE
        );
      });
    };

    chart?.on('dataZoom', handleZoom);

    if (mode === 'live') {
      interval = setInterval(() => {
        // clear any pending manual zoom gestures
        cancelAnimationFrame(frame);

        dispatch({ type: 'tick' });
      }, LIVE_MODE_REFRESH_RATE_MS);
    }

    return () => {
      chart?.off('dataZoom', handleZoom);
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, [chartRef, mode, dispatch, setViewport]);

  // Animate viewport changes based on the tick interval
  useEffect(() => {
    const { isDurationViewport, initial, end } = convertedViewport;
    const chart = chartRef.current;
    /**
     * only update the zoom imperatively if we are in live mode
     * or the date picker picks a new viewport
     *
     * It is possible that we have a duration viewport + echarts-gesture combo
     * so we are explicitly denying echarts-gesture
     */
    const shouldUpdate = chart != null || isDurationViewport || lastUpdatedBy === 'date-picker';
    if (!shouldUpdate || lastUpdatedBy === 'echarts-gesture') return;

    chart?.setOption({
      dataZoom: { ...DEFAULT_DATA_ZOOM, startValue: initial, endValue: end },
    });
  }, [chartRef, convertedViewport, lastUpdatedBy]);

  return convertedViewport;
};
