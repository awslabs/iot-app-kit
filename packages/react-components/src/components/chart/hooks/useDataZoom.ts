import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import { type DataZoomComponentOption, type EChartsType } from 'echarts';
import { type Viewport, viewportManager } from '@iot-app-kit/core';
import { useViewport } from '../../../hooks/useViewport';
import { ECHARTS_GESTURE } from '../../../common/constants';
import {
  DEFAULT_DATA_ZOOM,
  LIVE_MODE_REFRESH_RATE_MS,
} from '../eChartsConstants';
import { DEFAULT_VIEWPORT } from '../../time-sync';
import { useEffectOnce } from 'react-use';
import { convertViewportToMs } from '../../../utils/convertViewportToMs';

type ValidOption = {
  startValue: number;
  endValue: number;
};
const isValidZoomOption = (
  option: DataZoomComponentOption | undefined
): option is ValidOption =>
  option != null &&
  option.startValue != null &&
  option.endValue != null &&
  typeof option.startValue === 'number' &&
  typeof option.endValue === 'number';

type ViewportMode = 'live' | 'static';
const getViewportMode = (
  convertedViewport: ReturnType<typeof convertViewportToMs>
): ViewportMode => (convertedViewport.isDurationViewport ? 'live' : 'static');

type TickState = {
  mode: ViewportMode;
  viewport: Viewport | undefined;
  convertedViewport: ReturnType<typeof convertViewportToMs>;
};
type TickAction =
  | { type: 'tick' }
  | { type: 'pause' }
  | { type: 'updateViewport'; viewport: Viewport | undefined };
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
  } else if (action.type === 'pause') {
    return {
      ...state,
      mode: 'static',
    };
  } else if (action.type === 'updateViewport') {
    return stateFromViewport(action.viewport);
  }
  return state;
};

export const useDataZoom = (
  chartRef: MutableRefObject<EChartsType | null>,
  viewport: Viewport | undefined
) => {
  const { setViewport, group } = useViewport();
  const [{ mode, convertedViewport }, dispatch] = useReducer(
    reducer,
    stateFromViewport(viewport)
  );

  /**
   * function for setting the dataZoom chart option on the echart instance
   */
  const zoomChart = useCallback(
    ({ startValue, endValue }: { startValue: number; endValue: number }) => {
      const chart = chartRef.current;

      chart?.setOption({
        dataZoom: { ...DEFAULT_DATA_ZOOM, startValue, endValue },
      });
    },
    [chartRef]
  );

  /**
   * callback function for the viewport group subscription
   */
  const handleViewportUpdate = useCallback(
    (updatedViewport: Viewport, topic?: string) => {
      /**
       * we do not need to update the dataZoom if the event originated from
       * echarts since that is handled internally by echarts
       */
      if (topic === ECHARTS_GESTURE) return;

      const { initial, end } = convertViewportToMs(updatedViewport);

      /**
       * update the current viewport in the reducer
       * this ensures that the mode is up-to-date
       * in the event that the user changes from static -> live
       * this will restart the tick interval
       *
       * this also ensures that the duration is up-to-date
       * in the event that the user changes from for eg. 1min -> 10min
       */
      dispatch({ type: 'updateViewport', viewport: updatedViewport });

      zoomChart({ startValue: initial, endValue: end });
    },
    [dispatch, zoomChart]
  );

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
      dispatch({ type: 'pause' });

      if (!chart) return;

      // Synchronize animation with refresh rate
      frame = requestAnimationFrame(() => {
        // there should only be 1 datazoom option for the x axis
        const dataZoomOptions = chart.getOption()
          .dataZoom as DataZoomComponentOption[];
        const horizontalZoom = dataZoomOptions.at(0);
        if (!isValidZoomOption(horizontalZoom)) return;
        setViewport(
          {
            start: new Date(horizontalZoom.startValue),
            end: new Date(horizontalZoom.endValue),
          },
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

  /**
   * Handle setting the dataZoom for the chart
   * based on the tick interval
   * convertedViewport is updated in the setInterval loop above
   * as part of the tick action
   */
  useEffect(() => {
    const { isDurationViewport, initial, end } = convertedViewport;

    if (!isDurationViewport) return;

    zoomChart({ startValue: initial, endValue: end });
  }, [zoomChart, convertedViewport]);

  /**
   * any change to the viewport that is not an echarts gesture is synced
   * to the chart dataZoom
   */
  useEffect(() => {
    const { unsubscribe } = viewportManager.subscribe(
      group,
      handleViewportUpdate
    );
    return unsubscribe;
  }, [handleViewportUpdate, group]);

  /**
   * ensure the chart is zoomed to the current viewport before it
   * can start reacting to events
   */
  useEffectOnce(() => {
    handleViewportUpdate(viewport ?? DEFAULT_VIEWPORT);
  });

  return convertedViewport;
};
