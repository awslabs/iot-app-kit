import { useDrag } from 'react-dnd';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { DragEvent } from './types';
import {
  defaultDelta,
  deltaTracker,
  endTracker,
  startTracker,
} from './positionTracker';
import { constrainPosition } from './constrainPosition';
import { useEffect, useMemo } from 'react';
import { Animator } from '~/util/animate';

export type DragMonitorProps = {
  dragStart: (e: DragEvent) => void;
  dragEnd: (e: DragEvent) => void;
  drag: (e: DragEvent) => void;
  setCancelClick: (shouldCancelClick: boolean) => void;
  target: EventTarget | undefined;
  union: boolean;
  readOnly: boolean;
  enabled: boolean;
  dashboardGrid: DOMRect | null;
};

/**
 *
 * Handles triggering the drag gestures raised on the attached dragRef
 *
 */
export const useDragMonitor = ({
  setCancelClick,
  drag,
  dragEnd,
  dragStart,
  target,
  union,
  readOnly,
  enabled,
  dashboardGrid,
}: DragMonitorProps) => {
  const animator = useMemo(() => new Animator(), []);

  const [collected, dragRef] = useDrag(
    () => ({
      type: ItemTypes.Grid,
      item: (monitor) => {
        setCancelClick(true);
        dragStart({
          target,
          start: startTracker.getPosition(),
          end: endTracker.getPosition(),
          vector: defaultDelta,
          union,
        });
        deltaTracker.setPosition(monitor.getClientOffset() || defaultDelta);
        return {};
      },
      end: () => {
        setCancelClick(false);
        dragEnd({
          target,
          start: startTracker.getPosition(),
          end: endTracker.getPosition(),
          vector: defaultDelta,
          union,
        });
        deltaTracker.setPosition(defaultDelta);
      },
      collect: (monitor) => {
        return {
          monitor,
          type: monitor.getItemType(),
          isDragging: !!monitor.isDragging(),
          clientOffset: monitor.getClientOffset(),
        };
      },
      canDrag: !readOnly && enabled,
    }),
    [union, startTracker.getPosition(), endTracker.getPosition()]
  );

  const { isDragging, clientOffset } = collected;

  useEffect(() => {
    // We capture the current animation frame to enable cleanup on unmount
    let animationFrameId: number;

    if (isDragging && clientOffset) {
      if (!dashboardGrid) return;
      const constrainedOffset = constrainPosition({
        position: {
          x: clientOffset.x - dashboardGrid.x,
          y: clientOffset.y - dashboardGrid.y,
        },
        gridSize: dashboardGrid,
      });

      const constrainedDeltaTracker = constrainPosition({
        position: {
          x: deltaTracker.getPosition().x - dashboardGrid.x,
          y: deltaTracker.getPosition().y - dashboardGrid.y,
        },
        gridSize: dashboardGrid,
      });
      const offset = {
        x: constrainedOffset.x - constrainedDeltaTracker.x,
        y: constrainedOffset.y - constrainedDeltaTracker.y,
      };

      const updatedEndPosition = {
        x: endTracker.getPosition().x + offset.x,
        y: endTracker.getPosition().y + offset.y,
      };

      animationFrameId = animator.animate(() => {
        drag({
          target,
          start: startTracker.getPosition(),
          end: updatedEndPosition,
          vector: offset,
          union,
        });
        endTracker.setPosition(updatedEndPosition);
        deltaTracker.setPosition(clientOffset);
        setCancelClick(true);
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, clientOffset]);

  return {
    dragRef,
  };
};
