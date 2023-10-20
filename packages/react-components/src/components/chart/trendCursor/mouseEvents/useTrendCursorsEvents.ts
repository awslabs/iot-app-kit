import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { ECharts } from 'echarts';
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
}: UseEventsProps) => {
  // sync mode actions
  const addTrendCursorsToSyncState = useDataStore((state) => state.addTrendCursors);
  const updateTrendCursorsInSyncState = useDataStore((state) => state.updateTrendCursors);
  const deleteTrendCursorsInSyncState = useDataStore((state) => state.deleteTrendCursors);

  // https://stackoverflow.com/questions/55565444/how-to-register-event-with-useeffect-hooks
  // to avoid re-rendering of the event handler useEffect, following the pattern suggested in the above link
  const prevRef = useRef<MutableRefObject<ECharts | null> | null>(null);
  const seriesRef = useRef(series);
  const sizeRef = useRef(size);
  const isInCursorAddModeRef = useRef(isInCursorAddMode);
  const isInSyncModeRef = useRef(isInSyncMode);
  const graphicRef = useRef(graphic);
  const setGraphicRef = useRef(setGraphic);
  const onContextMenuRef = useRef(onContextMenu);
  const visualizationRef = useRef(visualization);

  const seriesDep = JSON.stringify(series);
  const graphicDep = JSON.stringify(graphic);

  // these properties will be updated in every render so that the event handlers below is not re-rendered everytime
  useEffect(() => {
    seriesRef.current = series;
    isInCursorAddModeRef.current = isInCursorAddMode;
    isInSyncModeRef.current = isInSyncMode;
    graphicRef.current = graphic;
    sizeRef.current = size;
    setGraphicRef.current = setGraphic;
    visualizationRef.current = visualization;
    // disabling because graphics and series are stringified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesDep, size, isInCursorAddMode, setGraphic, isInSyncMode, graphicDep, visualization]);

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
            visualization,
          });

          if (newTc) {
            setGraphicRef.current([...graphicRef.current, newTc]);
          }
        }
      }
    },
    // ignoring because refs dont need to be in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, visualization, addTrendCursorsToSyncState]
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
    },
    // ignoring because refs dont need to be in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, deleteTrendCursorsInSyncState]
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
    if (prevRef.current !== chartRef) {
      currentChart?.getZr().on('mousemove', () => mouseoverHandler(isInCursorAddModeRef.current, chartRef));

      // this handles all the clicks on the chart
      // this click would be either
      // 1. delete a TC
      // 2. add a TC
      currentChart?.getZr().on('click', (e) => {
        // index of the clicked graphic
        const graphicIndex = graphicRef.current.findIndex(
          (g) => g.children[TREND_CURSOR_CLOSE_GRAPHIC_INDEX].id === e?.target?.id
        );
        if (graphicIndex !== -1) {
          deleteTrendCursor(graphicIndex);
          return;
        } else {
          addNewTrendCursor({ posX: e.offsetX ?? 0, ignoreHotKey: false });
        }
      });

      // this is the ondrag handler of the trend cursor
      currentChart?.getZr().on('drag', (event) => {
        // update user feedback
        event.stop();
        currentChart?.getZr().setCursorStyle('grabbing');

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
      });

      currentChart?.getZr().on('contextmenu', (event) => {
        onContextMenuRef.current(event);
      });

      // Calculating delta in pixels between the initial interaction point vs the position of TC line
      // we need this to avoid snapping the TC line to the center of the point of the mouse's X

      currentChart?.getZr().on('dragstart', (event) => {
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
      });
    }

    prevRef.current = chartRef;
    return () => {
      currentChart?.getZr()?.off('click');
      // passing the function so that it will NOT remove all the mouseover behaviour, namely default tooltip
      currentChart?.getZr()?.off('mouseover', () => mouseoverHandler(isInCursorAddModeRef.current, chartRef));
      currentChart?.getZr()?.off('drag');
      currentChart?.getZr()?.off('contextmenu');
      currentChart?.getZr()?.off('dragstart');
    };
    // ignoring because refs dont need to be in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNewTrendCursor, deleteTrendCursor, groupId, updateTrendCursorsInSyncState]);

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
