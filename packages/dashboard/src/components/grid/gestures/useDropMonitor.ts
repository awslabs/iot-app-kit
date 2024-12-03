import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../components/dragLayer/itemTypes';
import { type ComponentPaletteDraggable } from '../../../components/palette/types';
import { DASHBOARD_CONTAINER_ID } from '../getDashboardPosition';
import { type DropEvent } from './types';

export type DropMonitorProps = {
  drop: (e: DropEvent) => void;
};

/**
 *
 * Handles triggering the drop gesture raised on the attached dropRef
 *
 */
export const useDropMonitor = ({ drop }: DropMonitorProps) => {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: [ItemTypes.Component],
      drop: (item: ComponentPaletteDraggable, monitor) => {
        const initialClientOffset = monitor.getInitialClientOffset(); // where the cursor was in the viewport when the drag started;
        const clientOffset = monitor.getClientOffset(); // where cursor is in the viewport when drop occurs;
        const gridRect = document
          .getElementById(DASHBOARD_CONTAINER_ID)
          ?.getBoundingClientRect();
        const itemRect = item.rect;

        if (!initialClientOffset || !clientOffset || !gridRect || !itemRect)
          return;

        // find cursor position in the grid
        const gridOffset = {
          x: clientOffset.x - gridRect.x,
          y: clientOffset.y - gridRect.y,
        };
        // find cursor position in the drag item
        const draggableOffset = {
          x: initialClientOffset.x - itemRect.x,
          y: initialClientOffset.y - itemRect.y,
        };
        // find top left corner of the drag item in the grid
        const position = {
          x: gridOffset.x - draggableOffset.x,
          y: gridOffset.y - draggableOffset.y,
        };

        drop({
          item,
          position,
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [drop]
  );

  return {
    isOver,
    dropRef,
  };
};
