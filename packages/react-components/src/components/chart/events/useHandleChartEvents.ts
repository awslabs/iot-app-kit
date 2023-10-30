import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { EChartsOption, EChartsType } from 'echarts';
import { KeyMap } from 'react-hotkeys';

export const useHandleChartEvents = (chartRef: MutableRefObject<EChartsType | null>) => {
  const [chartEventsOptions, setChartEventsOptions] = useState<EChartsOption>({});

  const [shiftDown, setShiftDown] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [prevIsGrabbing, setPrevIsGrabbing] = useState(false);

  // When dragging on the chart, turn off tooltip and set cursor to grabbing
  const setOnDragStart = (chart: EChartsType | null) => {
    setChartEventsOptions({
      tooltip: {
        show: false,
      },
    });
    chart?.getZr().setCursorStyle('grabbing');
  };

  // When dragging is done turn back on the tooltip and set cursor to grab
  // Use when the shift key is still held down but mouse is up
  const setOnDragEnd = (chart: EChartsType | null) => {
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
        if (mouseDown && shiftDown) {
          setOnDragStart(chartRef.current);
        } else if (shiftDown) {
          chartRef.current?.getZr().setCursorStyle('grab');
        }
      }
    },
    [chartRef, mouseDown, shiftDown]
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
    const mouseDownEventHandler = () => {
      setMouseDown(true);
      if (shiftDown) {
        setOnDragStart(chart);
      }
    };

    chart?.getZr().on('mousedown', mouseDownEventHandler);

    // When mouse is released only update when shift is also down
    const mouseUpEventHandler = () => {
      setMouseDown(false);
      if (shiftDown) {
        setOnDragEnd(chart);
      }
    };

    chart?.getZr().on('mouseup', mouseUpEventHandler);

    // Most important to update dragging events on mouse move
    const mouseMoveEventHandler = () => {
      const isGrabbing = mouseDown && shiftDown;

      // Only update tooltip when state changed
      let stateChanged = false;
      if (isGrabbing !== prevIsGrabbing) {
        setPrevIsGrabbing(isGrabbing);
        stateChanged = true;
      } else {
        stateChanged = false;
      }

      // Overwrite cursor style on every move of the mouse
      // Update tooltip only once, on grab state change
      if (isGrabbing) {
        chart?.getZr().setCursorStyle('grabbing');
        if (stateChanged) {
          setOnDragStart(chart);
        }
      } else if (shiftDown) {
        chart?.getZr().setCursorStyle('grab');
        if (stateChanged) {
          setOnDragEnd(chart);
        }
      }
    };

    chart?.getZr().on('mousemove', mouseMoveEventHandler);

    return () => {
      chart?.getZr()?.off('mousemove', mouseMoveEventHandler);
      chart?.getZr()?.off('mouseup', mouseUpEventHandler);
      chart?.getZr()?.off('mousedown', mouseDownEventHandler);
    };
  }, [chartRef, shiftDown, mouseDown, prevIsGrabbing]);

  return { chartEventsOptions, chartEventsKeyMap, chartEventsHandlers };
};
