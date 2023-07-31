import { RefObject, useEffect, useRef } from 'react';
import { EChartsType, getInstanceByDom } from 'echarts';
import { MAX_TREND_CURSORS, TREND_CURSOR_CLOSE_GRAPHIC_INDEX } from '../eChartsConstants';
import { calculateTimeStamp } from '../utils/getInfo';
import { v4 as uuid } from 'uuid';
import { getNewTrendCursor, onDragUpdateTrendCursor } from '../utils/getTrendCursor';
import { UseEventsProps } from '../types';
import useDataStore from '../../../store';

let trendCursorStaticIndex = 0;

const useTrendCursorsEvents = ({
  ref,
  graphic,
  size,
  isInCursorAddMode,
  setGraphic,
  viewport,
  series,
  yMin,
  yMax,
  isInSyncMode,
  groupId,
}: UseEventsProps) => {
  // sync mode actions
  const addTrendCursorsToSyncState = useDataStore((state) => state.addTrendCursors);
  const updateTrendCursorsInSyncState = useDataStore((state) => state.updateTrendCursors);
  const deleteTrendCursorsInSyncState = useDataStore((state) => state.deleteTrendCursors);
  const mouseoverHandler = (isInCursorAddMode: boolean, chart?: EChartsType) => {
    if (isInCursorAddMode) {
      chart?.getZr().setCursorStyle('crosshair');
    } else {
      chart?.getZr().setCursorStyle('auto');
    }
  };

  // https://stackoverflow.com/questions/55565444/how-to-register-event-with-useeffect-hooks
  // to avoid re-rendering of the event handler useEffect, following the pattern suggested in the above link
  const prevRef = useRef<RefObject<HTMLDivElement> | null>(null);
  const seriesRef = useRef(series);
  const sizeRef = useRef(size);
  const isInCursorAddModeRef = useRef(isInCursorAddMode);
  const viewportRef = useRef(viewport);
  const yMinRef = useRef(yMin);
  const yMaxRef = useRef(yMax);
  const isInSyncModeRef = useRef(isInSyncMode);
  const graphicRef = useRef(graphic);
  const setGraphicRef = useRef(setGraphic);

  // these properties will be updated in every render so that the event handlers below is not re-rendered everytime
  useEffect(() => {
    seriesRef.current = series;
    yMinRef.current = yMin;
    yMaxRef.current = yMax;
    viewportRef.current = viewport;
    isInCursorAddModeRef.current = isInCursorAddMode;
    isInSyncModeRef.current = isInSyncMode;
    graphicRef.current = graphic;
    sizeRef.current = size;
    setGraphicRef.current = setGraphic;
  }, [series, size, isInCursorAddMode, setGraphic, viewport, yMin, yMax, isInSyncMode, graphic]);

  // The below event handlers will handle both sync and standalone mode
  // sync mode --> dispatches the actions from the store
  // standalone mode --> updates the local state
  useEffect(() => {
    if (prevRef.current !== ref) {
      let chart: EChartsType | undefined;
      if (ref.current !== null) {
        chart = getInstanceByDom(ref.current);
        chart?.getZr().on('mousemove', () => mouseoverHandler(isInCursorAddModeRef.current, chart));

        // this handles all the clicks on the chart
        // this click would be either
        // 1. delete a TC
        // 2. add a TC
        chart?.getZr().on('click', (e) => {
          // index of the clicked graphic
          const graphicIndex = graphicRef.current.findIndex(
            (g) => g.children[TREND_CURSOR_CLOSE_GRAPHIC_INDEX].id === e?.target?.id
          );

          // delete tc
          if (graphicIndex !== -1) {
            if (isInSyncModeRef.current) {
              deleteTrendCursorsInSyncState({
                groupId: groupId ?? '',
                tcId: graphicRef.current[graphicIndex].id as string,
              });
            } else {
              graphicRef.current[graphicIndex].$action = 'remove';
              graphicRef.current[graphicIndex].children = []; // Echarts will throw error if children are not empty
              chart?.setOption({ graphic: graphicRef.current });
              graphicRef.current.splice(graphicIndex, 1);
              setGraphicRef.current([...graphicRef.current]);
            }
          }

          // add TC
          if (isInCursorAddModeRef.current && graphicRef.current.length < MAX_TREND_CURSORS) {
            if (isInSyncModeRef.current) {
              const timestampInMs = calculateTimeStamp(e?.offsetX ?? 0, sizeRef.current.width, viewportRef.current);
              addTrendCursorsToSyncState({
                groupId: groupId ?? '',
                tcId: `trendCursor-${uuid()}`,
                timestamp: timestampInMs,
                tcHeaderColorIndex: trendCursorStaticIndex++,
              });
            } else {
              const newTc = getNewTrendCursor({
                e,
                size: sizeRef.current,
                tcHeaderColorIndex: trendCursorStaticIndex++,
                series: seriesRef.current,
                yMin: yMinRef.current,
                yMax: yMaxRef.current,
                viewport: viewportRef.current,
              });

              setGraphicRef.current([...graphicRef.current, newTc]);
            }
          }
        });

        // this is the ondrag handler of the trend cursor
        chart?.getZr().on('drag', (event) => {
          if (event.target.id.toString().startsWith('line')) {
            const graphicIndex = graphicRef.current.findIndex((g) => g.children[0].id === event.target.id);
            const timeInMs = calculateTimeStamp(event.offsetX ?? 0, sizeRef.current.width, viewportRef.current);
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
                posX: event.offsetX ?? 0,
                timeInMs,
                size: sizeRef.current,
                series: seriesRef.current,
                yMax: yMaxRef.current,
                yMin: yMinRef.current,
              });
              // update component state
              setGraphicRef.current([...graphicRef.current]);
            }
          }
        });
      }

      return () => {
        if (ref.current !== null) {
          chart?.getZr().off('click');
          // passing the function so that it will NOT remove all the mouseover behaviour, namely default tooltip
          chart?.getZr().off('mouseover', () => mouseoverHandler(isInCursorAddModeRef.current, chart));
          chart?.getZr().off('drag');
        }
      };
    }
    prevRef.current = ref;
  }, [ref]);
};

export default useTrendCursorsEvents;
