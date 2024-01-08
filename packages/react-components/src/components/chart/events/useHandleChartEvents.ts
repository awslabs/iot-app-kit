import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { EChartsOption, EChartsType, ElementEvent } from 'echarts';
import { KeyMap } from 'react-hotkeys';

export const useHandleChartEvents = (
  chartRef: MutableRefObject<EChartsType | null>
) => {
  const [chartEventsOptions, setChartEventsOptions] = useState<EChartsOption>(
    {}
  );

  const [shiftDown, setShiftDown] = useState(false);
  const [prevIsPanning, setPrevIsPanning] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isBrushZooming, setIsBrushZooming] = useState(false);

  // When panning on the chart, turn off tooltip and set cursor to grabbing
  const setOnPanStart = (chart: EChartsType | null) => {
    setIsPanning(true);
    setChartEventsOptions({
      tooltip: {
        show: false,
      },
    });
    chart?.getZr().setCursorStyle('grabbing');
  };

  // When dragging is done turn back on the tooltip and set cursor to grab
  // Use when the shift key is still held down but mouse is up
  const setOnPanEnd = (chart: EChartsType | null) => {
    setIsPanning(false);
    setChartEventsOptions({
      tooltip: {
        show: true,
      },
    });
    chart?.getZr().setCursorStyle('grab');
  };

  // When shift is held down show the grab cursor by default
  // When mouse is also held down it is a grabbing event
  const shiftDownListener = useCallback(
    (event?: KeyboardEvent) => {
      if (event) {
        setShiftDown(event.shiftKey);
        if (isPanning) {
          setOnPanStart(chartRef.current);
        } else if (shiftDown) {
          chartRef.current?.getZr().setCursorStyle('grab');
        }
      }
    },
    [chartRef, isPanning, shiftDown]
  );

  // When shift is released go back to the default cursor
  const shiftUpListener = useCallback(
    (event?: KeyboardEvent) => {
      if (event?.key.toLowerCase() === 'shift') {
        setShiftDown(false);
        chartRef.current?.getZr().setCursorStyle('default');
      }
    },
    [chartRef]
  );

  const chartEventsKeyMap: KeyMap = {
    shiftDown: { sequence: 'shift', action: 'keydown' },
    shiftUp: { sequence: 'shift', action: 'keyup' },
  };

  const chartEventsHandlers = {
    shiftDown: (keyEvent?: KeyboardEvent) => shiftDownListener(keyEvent),
    shiftUp: (keyEvent?: KeyboardEvent) => shiftUpListener(keyEvent),
  };

  // Set up event listeners for pressing shift and dragging the mouse to update
  // the cursor and tooltip
  useEffect(() => {
    const chart = chartRef?.current;

    // Define event handler function so that we can remove this specific behavior on re-render

    // When mouse is down only update when shift is also down
    // if the brush zoom is selected, prevent event propagation
    const mouseDownEventHandler = (e: ElementEvent) => {
      if (shiftDown) {
        setOnPanStart(chart);
      }
      if (isBrushZooming) {
        e.stop();
      }
    };

    chart?.getZr().on('mousedown', mouseDownEventHandler);

    // When mouse is released only update when shift is also down
    const mouseUpEventHandler = () => {
      if (shiftDown) {
        setOnPanEnd(chart);
      }
    };

    chart?.getZr().on('mouseup', mouseUpEventHandler);

    // Most important to update dragging events on mouse move
    const mouseMoveEventHandler = () => {
      // Only update tooltip when state changed
      let stateChanged = false;
      if (isPanning !== prevIsPanning) {
        setPrevIsPanning(isPanning);
        stateChanged = true;
      } else {
        stateChanged = false;
      }

      // Overwrite cursor style on every move of the mouse
      // Update tooltip only once, on grab state change
      if (isPanning) {
        setIsPanning(true);
        chart?.getZr().setCursorStyle('grabbing');
        if (stateChanged) {
          setOnPanStart(chart);
        }
      } else if (shiftDown && !isPanning) {
        chart?.getZr().setCursorStyle('grab');
        if (stateChanged) {
          setOnPanEnd(chart);
        }
      }
    };

    chart?.getZr().on('mousemove', mouseMoveEventHandler);

    const zoomClickHandler = (e: unknown) => {
      if (e && typeof e === 'object' && 'dataZoomSelectActive' in e) {
        setIsBrushZooming(!!e.dataZoomSelectActive);
      }
    };
    chart?.on('globalcursortaken', zoomClickHandler);

    return () => {
      chart?.getZr()?.off('mousemove', mouseMoveEventHandler);
      chart?.getZr()?.off('mouseup', mouseUpEventHandler);
      chart?.getZr()?.off('mousedown', mouseDownEventHandler);
      chart?.off('globalcursortaken', zoomClickHandler);
    };
  }, [chartRef, isBrushZooming, shiftDown, isPanning, prevIsPanning]);

  return { chartEventsOptions, chartEventsKeyMap, chartEventsHandlers };
};
