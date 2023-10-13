import { MutableRefObject, useEffect, useState } from 'react';
import { EChartsOption, EChartsType } from 'echarts';

export const useHandleChartEvents = (chartRef: MutableRefObject<EChartsType | null>) => {
  const [optionState, setOptionState] = useState<EChartsOption>({});

  // When dragging on the chart, turn off tooltip and set cursor to grabbing
  const setOnDragStart = (chart: EChartsType | null) => {
    setOptionState({
      tooltip: {
        show: false,
      },
    });
    chart?.getZr().setCursorStyle('grabbing');
  };

  // When dragging is done turn back on the tooltip and set cursor to grab
  // Use when the shift key is still held down but mouse is up
  const setOnDragEnd = (chart: EChartsType | null) => {
    setOptionState({
      tooltip: {
        show: true,
      },
    });
    chart?.getZr().setCursorStyle('grab');
  };

  // Set up event listeners for pressing shift and dragging the mouse to update
  // the cursor and tooltip
  useEffect(() => {
    const chart = chartRef?.current;

    let shiftDown = false;
    let mouseDown = false;
    let prevIsGrabbing = false;

    // When shift is held down show the grab cursor by default
    // When mouse is also held down it is a grabbing event
    const shiftDownListener = (event: KeyboardEvent) => {
      shiftDown = event.shiftKey;
      if (mouseDown && shiftDown) {
        setOnDragStart(chart);
      } else if (shiftDown) {
        chart?.getZr().setCursorStyle('grab');
      }
    };

    // When shift is released go back to the default cursor
    const shiftUpListener = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'shift') {
        shiftDown = false;
        chart?.getZr().setCursorStyle('default');
      }
    };

    window.addEventListener('keydown', shiftDownListener);
    window.addEventListener('keyup', shiftUpListener);

    // When mouse is down only update when shift is also down
    chart?.getZr().on('mousedown', () => {
      mouseDown = true;
      if (shiftDown) {
        setOnDragStart(chart);
      }
    });

    // When mouse is released only update when shift is also down
    chart?.getZr().on('mouseup', () => {
      mouseDown = false;
      if (shiftDown) {
        setOnDragEnd(chart);
      }
    });

    // Most important to update dragging events on mouse move
    chart?.getZr().on('mousemove', () => {
      const isGrabbing = mouseDown && shiftDown;

      // Only update tooltip when state changed
      let stateChanged = false;
      if (isGrabbing !== prevIsGrabbing) {
        prevIsGrabbing = isGrabbing;
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
    });

    return () => {
      window.removeEventListener('keydown', shiftDownListener);
      window.removeEventListener('keyup', shiftUpListener);
      chart?.getZr()?.off('mousemove');
      chart?.getZr()?.off('mouseup');
      chart?.getZr()?.off('mousedown');
    };
  }, [chartRef]);

  return optionState;
};
