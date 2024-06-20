import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import {
  DataZoomComponentOption,
  ECharts,
  ToolboxComponentOption,
} from 'echarts';
import {
  Viewport,
  isHistoricalViewport,
  viewportEndDate,
  viewportManager,
  viewportStartDate,
} from '@iot-app-kit/core';

import { useViewport } from '../../hooks/useViewport';
import {
  DEFAULT_DATA_ZOOM,
  DEFAULT_DATA_ZOOM_GESTURES_DISABLED,
  DEFAULT_DATA_ZOOM_GESTURES_ENABLED,
  DEFAULT_TOOLBOX_GESTURES_ENABLED,
  DEFAULT_TOOLBOX_GESTURES_DISABLED,
  ECHARTS_GESTURE,
  LIVE_MODE_REFRESH_RATE_MS,
} from './constants';
import { DEFAULT_VIEWPORT } from '../../components/time-sync';
import merge from 'lodash.merge';
import useIntlStore from '../../translations';
import { UtilizedViewportType } from '../../hooks/useViewport/useUtilizedViewport';

const isDurationViewport = (viewport: Viewport | undefined) =>
  !!(viewport && !isHistoricalViewport(viewport));

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
const getViewportMode = (viewport: Viewport | undefined): ViewportMode =>
  isDurationViewport(viewport) ? 'live' : 'static';

const convertViewport = (viewport: Viewport | undefined) => ({
  isDurationViewport: isDurationViewport(viewport),
  start: viewport ? viewportStartDate(viewport).getTime() : 0,
  end: viewport ? viewportEndDate(viewport).getTime() : 0,
});

type TickState = {
  mode: ViewportMode;
  // Used in live mode
  viewport: Viewport | undefined;
  // Used to set data zoom
  convertedViewport: {
    start: number;
    end: number;
    isDurationViewport: boolean;
  };
};
type TickAction =
  | { type: 'tick' }
  | { type: 'pause' }
  | { type: 'updateViewport'; viewport: Viewport | undefined };
const stateFromViewport = (viewport: Viewport | undefined) => {
  return {
    mode: getViewportMode(viewport),
    viewport,
    convertedViewport: convertViewport(viewport),
  };
};
const reducer = (state: TickState, action: TickAction): TickState => {
  if (action.type === 'tick') {
    return {
      ...state,
      mode: 'live',
      convertedViewport: convertViewport(state.viewport),
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

const updateGesturesOptions = (
  gestures: boolean | undefined,
  dataZoomOption: DataZoomComponentOption,
  toolboxOption: ToolboxComponentOption
) => {
  if (gestures) {
    // enabled gestures specific option settings
    dataZoomOption = {
      ...dataZoomOption,
      ...DEFAULT_DATA_ZOOM_GESTURES_ENABLED,
    };
    toolboxOption = DEFAULT_TOOLBOX_GESTURES_ENABLED;
  } else {
    // disabled gestures specific option settings
    dataZoomOption = {
      ...dataZoomOption,
      ...DEFAULT_DATA_ZOOM_GESTURES_DISABLED,
    };
    toolboxOption = DEFAULT_TOOLBOX_GESTURES_DISABLED;
  }
  return { dataZoomOption, toolboxOption };
};

const dispatchGesturesEnablement = (
  gestures?: boolean,
  chart?: ECharts | null
) => {
  if (!gestures) {
    chart?.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: false,
    });
  }
};

export const useUnboundedDataZoom = ({
  chart,
  gestures,
  viewport,
  setViewport,
  viewportType,
}: {
  chart: ECharts | null;
  gestures?: boolean;
  viewport: Viewport | undefined;
  setViewport?: (viewport: Viewport, lastUpdatedBy?: string) => void;
  viewportType: UtilizedViewportType;
}) => {
  const frameRef = useRef<number>(0);

  const intl = useIntlStore((state) => state.intl);

  const zoomTitle = intl.formatMessage({
    id: 'echarts.toolbox.features.dataZoom.title.zoom',
    description:
      'Title for the dataZoom toolbox feature in an echarts instance',
    defaultMessage: 'Zoom',
  });
  const backZoomTitle = intl.formatMessage({
    id: 'echarts.toolbox.features.dataZoom.title.back',
    description:
      'Title for the undo dataZoom toolbox feature in an echarts instance',
    defaultMessage: 'Undo\nzoom',
  });

  const { group } = useViewport();
  const [{ mode, convertedViewport }, dispatch] = useReducer(
    reducer,
    stateFromViewport(viewport)
  );

  const zoomCache = useRef<DataZoomComponentOption | undefined>(undefined);
  useEffect(() => {
    if (chart && zoomCache.current) {
      let dataZoomOption = zoomCache.current;
      let toolboxOption = DEFAULT_TOOLBOX_GESTURES_ENABLED;

      ({ dataZoomOption, toolboxOption } = updateGesturesOptions(
        gestures,
        dataZoomOption,
        toolboxOption
      ));

      toolboxOption = merge(toolboxOption, {
        feature: {
          dataZoom: { title: { zoom: zoomTitle, back: backZoomTitle } },
        },
      });

      // WARN: enablement needs to dispatch before chart option
      dispatchGesturesEnablement(gestures, chart);
      chart.setOption({
        dataZoom: dataZoomOption,
        toolbox: toolboxOption,
      });
    }
  }, [chart, zoomTitle, backZoomTitle, gestures]);

  /**
   * function for setting the dataZoom chart option on the echart instance
   */
  const zoomChart = useCallback(
    ({ startValue, endValue }: { startValue: number; endValue: number }) => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        let dataZoomOption: DataZoomComponentOption = {
          ...DEFAULT_DATA_ZOOM,
          startValue,
          endValue,
        };
        let toolboxOption = DEFAULT_TOOLBOX_GESTURES_ENABLED;

        ({ dataZoomOption, toolboxOption } = updateGesturesOptions(
          gestures,
          dataZoomOption,
          toolboxOption
        ));

        zoomCache.current = dataZoomOption;

        // WARN: enablement needs to dispatch before chart option
        dispatchGesturesEnablement(gestures, chart);
        chart?.setOption({
          dataZoom: dataZoomOption,
          toolbox: toolboxOption,
        });
      });
    },
    [chart, gestures]
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

      const { start, end, isDurationViewport } =
        convertViewport(updatedViewport);
      if (isDurationViewport) {
        zoomCache.current = undefined;
      }

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

      zoomChart({ startValue: start, endValue: end });
    },
    [dispatch, zoomChart]
  );

  useEffect(() => {
    if (!chart) return;
    let interval: NodeJS.Timer;

    /**
     * Sync the viewport of the chart from manual data zoom gestures
     * to the viewport context
     */
    const handleZoom = () => {
      cancelAnimationFrame(frameRef.current);

      // clear the viewport tick interval
      clearInterval(interval);
      dispatch({ type: 'pause' });

      if (!chart) return;

      // Synchronize animation with refresh rate
      frameRef.current = requestAnimationFrame(() => {
        if (!setViewport) return;
        // there should only be 1 datazoom option for the x axis
        const dataZoomOptions = chart.getOption()
          .dataZoom as DataZoomComponentOption[];
        const horizontalZoom = dataZoomOptions.at(0);
        if (!isValidZoomOption(horizontalZoom)) return;
        zoomCache.current = horizontalZoom;
        const updatedViewport = {
          start: new Date(horizontalZoom.startValue),
          end: new Date(horizontalZoom.endValue),
        };
        setViewport(updatedViewport, ECHARTS_GESTURE);
      });
    };

    chart?.on('dataZoom', handleZoom);

    if (mode === 'live') {
      interval = setInterval(() => {
        zoomCache.current = undefined;
        // clear any pending manual zoom gestures
        cancelAnimationFrame(frameRef.current);

        dispatch({ type: 'tick' });
      }, LIVE_MODE_REFRESH_RATE_MS);
    }

    return () => {
      chart?.off('dataZoom', handleZoom);
      cancelAnimationFrame(frameRef.current);
      clearInterval(interval);
    };
  }, [chart, mode, dispatch, setViewport]);

  /**
   * Handle setting the dataZoom for the chart
   * based on the tick interval
   * convertedViewport is updated in the setInterval loop above
   * as part of the tick action
   */
  useEffect(() => {
    const { isDurationViewport, start, end } = convertedViewport;

    if (!isDurationViewport || zoomCache.current) return;

    zoomChart({ startValue: start, endValue: end });
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

  /**
   * ensure the updates to the viewport that are
   * from the top level prop are applied
   */
  useUpdateEffect(() => {
    if (viewportType === 'passed-in') {
      handleViewportUpdate(viewport ?? DEFAULT_VIEWPORT);
    }
  }, [viewportType, viewport]);
};
