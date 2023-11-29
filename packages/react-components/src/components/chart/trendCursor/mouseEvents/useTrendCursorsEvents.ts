import { useCallback, useEffect, useRef } from 'react';
import { getPlugin } from '@iot-app-kit/core';
import { calculateNearestTcIndex, calculateXFromTimestamp, formatCopyData } from '../calculations/calculations';
import { v4 as uuid } from 'uuid';
import { getNewTrendCursor } from '../getTrendCursor/getTrendCursor';
import useDataStore from '../../../../store';
import { Action } from '../../contextMenu/ChartContextMenu';
import copy from 'copy-to-clipboard';
import { MAX_TREND_CURSORS, TREND_CURSOR_CLOSE_GRAPHIC_INDEX } from '../constants';
import { UseEventsProps } from '../types';
import { onDragUpdateTrendCursor } from './handlers/drag/update';
import { calculateTimeStamp } from '../calculations/timestamp';
import { mouseoverHandler } from './handlers/mouseover';
import { ElementEvent } from 'echarts';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';
import { onResizeUpdateTrendCursorYValues } from '../resize/updateYValues';

const useTrendCursorsEvents = ({
  chartRef,
  graphic,
  size,
  isInCursorAddMode,
  setGraphic,
  series,
  isInSyncMode,
  groupId,
  onContextMenu,
  visualization,
  significantDigits,
}: UseEventsProps) => {
  // sync mode actions
  const addTrendCursorsToSyncState = useDataStore((state) => state.addTrendCursors);
  const updateTrendCursorsInSyncState = useDataStore((state) => state.updateTrendCursors);
  const deleteTrendCursorsInSyncState = useDataStore((state) => state.deleteTrendCursors);

  const seriesRef = useRef(series);
  const sizeRef = useRef(size);
  const isInCursorAddModeRef = useRef(isInCursorAddMode);
  const isInSyncModeRef = useRef(isInSyncMode);
  const graphicRef = useRef(graphic);
  const setGraphicRef = useRef(setGraphic);
  const onContextMenuRef = useRef(onContextMenu);
  const visualizationRef = useRef(visualization);
  const significantDigitsRef = useRef(significantDigits);

  // these properties will be updated in every render so that the event handlers below is not re-rendered everytime
  useEffect(() => {
    seriesRef.current = series;
    isInCursorAddModeRef.current = isInCursorAddMode;
    isInSyncModeRef.current = isInSyncMode;
    graphicRef.current = graphic;
    sizeRef.current = size;
    setGraphicRef.current = setGraphic;
    visualizationRef.current = visualization;
    significantDigitsRef.current = significantDigits;
  }, [size, isInCursorAddMode, setGraphic, isInSyncMode, visualization, significantDigits, series, graphic]);

  // shared add function between the context menu and on click action
  const addNewTrendCursor = useCallback(
    ({ posX, ignoreHotKey }: { posX: number; ignoreHotKey: boolean }) => {
      // when adding through the context menu, we can ignore the hot key press
      if ((ignoreHotKey || isInCursorAddModeRef.current) && graphicRef.current.length < MAX_TREND_CURSORS) {
        if (isInSyncModeRef.current) {
          const timestampInMs = calculateTimeStamp(posX, chartRef);
          addTrendCursorsToSyncState({
            groupId: groupId ?? '',
            tcId: `trendCursor-${uuid()}`,
            timestamp: timestampInMs,
          });
        } else {
          const newTc = getNewTrendCursor({
            size: sizeRef.current,
            series: seriesRef.current,
            x: posX,
            chartRef,
            visualization: visualizationRef.current,
            significantDigits: significantDigitsRef.current,
          });

          if (newTc) {
            setGraphicRef.current([...graphicRef.current, newTc]);
          }
        }

        const metricsRecorder = getPlugin('metricsRecorder');
        metricsRecorder?.record({
          metricName: 'TrendCursorAdd',
          metricValue: 1,
        });
      }
    },
    [chartRef, addTrendCursorsToSyncState, groupId]
  );

  // shared delete function between the context menu and on click actions
  const deleteTrendCursor = useCallback(
    (toBeDeletedGraphicIndex: number) => {
      if (isInSyncModeRef.current) {
        deleteTrendCursorsInSyncState({
          groupId: groupId ?? '',
          tcId: graphicRef.current[toBeDeletedGraphicIndex].id as string,
        });
      } else {
        graphicRef.current[toBeDeletedGraphicIndex].$action = 'remove';
        graphicRef.current[toBeDeletedGraphicIndex].children = []; // Echarts will throw error if children are not empty
        chartRef.current?.setOption({ graphic: graphicRef.current });
        graphicRef.current.splice(toBeDeletedGraphicIndex, 1);
        setGraphicRef.current([...graphicRef.current]);
      }

      const metricsRecorder = getPlugin('metricsRecorder');
      metricsRecorder?.record({
        metricName: 'TrendCursorDelete',
        metricValue: 1,
      });
    },
    [deleteTrendCursorsInSyncState, groupId, chartRef]
  );
  const deleteTrendCursorByPosition = (clickedPosX: number) => {
    const timestampOfClick = calculateTimeStamp(clickedPosX, chartRef);
    const toBeDeletedGraphicIndex = calculateNearestTcIndex(graphicRef.current, timestampOfClick);
    deleteTrendCursor(toBeDeletedGraphicIndex);
  };
  // The below event handlers will handle both sync and standalone mode
  // sync mode --> dispatches the actions from the store
  // standalone mode --> updates the local state
  useEffect(() => {
    const currentChart = chartRef.current;
    if (isInCursorAddModeRef.current && graphicRef.current.length < MAX_TREND_CURSORS) {
      chartRef.current?.getZr().setCursorStyle('crosshair');
    } else {
      chartRef.current?.getZr().setCursorStyle('default'); // in case we get out of add mode and mouse does not move, switch back to default cursor
    }

    const mouseMoveEventHandler = () => mouseoverHandler(isInCursorAddModeRef.current, graphicRef.current, chartRef);

    // this handles all the clicks on the chart
    // this click would be either
    // 1. delete a TC
    // 2. add a TC
    const clickEventHandler = (event: ElementEvent) => {
      // index of the clicked graphic
      const graphicIndex = graphicRef.current.findIndex(
        (g) => g.children[TREND_CURSOR_CLOSE_GRAPHIC_INDEX].id === event?.target?.id
      );
      if (graphicIndex !== -1) {
        deleteTrendCursor(graphicIndex);
        return;
      } else {
        addNewTrendCursor({ posX: event.offsetX ?? 0, ignoreHotKey: false });
      }
    };

    // this is the ondrag handler of the trend cursor
    const dragEventHandler = (event: ElementEvent) => {
      // update user feedback
      event.stop();
      chartRef.current?.getZr().setCursorStyle('grabbing');

      let graphicIndex = graphicRef.current.findIndex((g) => g.children[0].id === event.target.id);

      if (graphicIndex === -1) {
        graphicIndex = graphicRef.current.findIndex((g) => g.children[1].id === event.target.id);
      }

      const posX = (event.offsetX ?? 0) + (graphicRef.current[graphicIndex]?.dragDeltaInPixels ?? 0);
      const timeInMs = calculateTimeStamp(posX, chartRef);

      if (isInSyncModeRef.current) {
        updateTrendCursorsInSyncState({
          groupId: groupId ?? '',
          timestamp: timeInMs,
          tcId: graphicRef.current[graphicIndex].id as string,
        });
      } else {
        // update current TC
        graphicRef.current[graphicIndex] = onDragUpdateTrendCursor({
          graphic: graphicRef.current[graphicIndex],
          posX,
          timeInMs,
          size: sizeRef.current,
          series: seriesRef.current,
          chartRef,
          visualization: visualizationRef.current,
        });
        // update component state
        setGraphicRef.current([...graphicRef.current]);
      }
    };

    const contextMenuEventHandler = (event: ElementEvent) => {
      onContextMenuRef.current(event);
    };

    // Calculating delta in pixels between the initial interaction point vs the position of TC line
    // we need this to avoid snapping the TC line to the center of the point of the mouse's X

    const dragStartEventHandler = (event: ElementEvent) => {
      let graphicIndex = graphicRef.current.findIndex((g) => g.children[0].id === event.target.id);

      if (graphicIndex === -1) {
        graphicIndex = graphicRef.current.findIndex((g) => g.children[1].id === event.target.id);
      }

      const dragDeltaInPixels =
        calculateXFromTimestamp(graphicRef.current[graphicIndex].timestampInMs, chartRef) - event.offsetX;

      graphicRef.current[graphicIndex] = {
        ...graphicRef.current[graphicIndex],
        dragDeltaInPixels,
      };
      setGraphicRef.current([...graphicRef.current]);
    };

    // additional zoom handler, this is to avoid the "lag" because we throttle "datazoom" event when handling viewport
    const zoomHandler = () => {
      const newG = graphicRef.current.map((g) => {
        // updating the series line marker's y value
        const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } = calculateSeriesMakers(
          seriesRef.current,
          g.timestampInMs,
          chartRef,
          visualizationRef.current,
          significantDigitsRef.current
        );
        g.yAxisMarkerValue = trendCursorsSeriesMakersValue;
        // update line height and markers
        g.children = onResizeUpdateTrendCursorYValues(g.children, trendCursorsSeriesMakersInPixels, sizeRef.current);
        // updating x of the graphic
        g.x = calculateXFromTimestamp(g.timestampInMs, chartRef);
        return g;
      });

      setGraphic([...newG]);
    };

    // passing the function so that we can remove this specific behavior on re-render
    currentChart?.getZr().on('click', clickEventHandler);
    currentChart?.getZr().on('mousemove', mouseMoveEventHandler);
    currentChart?.getZr().on('drag', dragEventHandler);
    currentChart?.getZr().on('contextmenu', contextMenuEventHandler);
    currentChart?.getZr().on('dragstart', dragStartEventHandler);
    currentChart?.on('datazoom', zoomHandler);

    return () => {
      // passing the function so that it will NOT remove all event behaviour
      currentChart?.getZr()?.off('click', clickEventHandler);
      currentChart?.getZr()?.off('mouseover', mouseMoveEventHandler);
      currentChart?.getZr()?.off('drag', dragEventHandler);
      currentChart?.getZr()?.off('contextmenu', contextMenuEventHandler);
      currentChart?.getZr()?.off('dragstart', dragStartEventHandler);
      currentChart?.off('datazoom', zoomHandler);
    };
  }, [
    addNewTrendCursor,
    deleteTrendCursor,
    groupId,
    updateTrendCursorsInSyncState,
    chartRef,
    setGraphic,
    isInCursorAddMode,
  ]);

  const copyTrendCursorData = (posX: number) => {
    const timestampOfClick = calculateTimeStamp(posX, chartRef);
    const toBeCopiedGraphicIndex = calculateNearestTcIndex(graphicRef.current, timestampOfClick);
    // using copy-to-clipboard library to copy in a Excel sheet paste-able format
    copy(formatCopyData(graphicRef.current[toBeCopiedGraphicIndex], seriesRef.current), { format: 'text/plain' });
  };

  // this handles the user interaction via context menu
  const onContextMenuClickHandler = ({ action, posX }: { action: Action; posX: number }) => {
    switch (action) {
      case 'add':
        addNewTrendCursor({ posX: posX, ignoreHotKey: true });
        break;
      case 'delete':
        deleteTrendCursorByPosition(posX);
        break;
      case 'copy':
        copyTrendCursorData(posX);
        break;
    }
  };

  return { onContextMenuClickHandler };
};

export default useTrendCursorsEvents;
