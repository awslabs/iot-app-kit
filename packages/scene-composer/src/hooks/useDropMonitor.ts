import { TargetType } from 'dnd-core';
import { useDrop } from 'react-dnd';

export type DropHandler<TItem> = (
  item: TItem,
  meta: { isOver: boolean; isOverCurrent: boolean; beenHandled: boolean },
) => void;

function useDropMonitor<TItem>(type: TargetType, onDrop: DropHandler<TItem> = () => {}) {
  const [{ isOver, isOverCurrent }, dropRef] = useDrop(
    () => ({
      accept: type,
      drop(_item: TItem, monitor) {
        const didDrop = monitor.didDrop();
        const isOverCurrent = monitor.isOver({ shallow: true });
        const isOver = monitor.isOver();

        onDrop(_item, { isOver, isOverCurrent, beenHandled: didDrop });
      },
      // istanbul ignore next
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [],
  );

  return {
    isOver,
    isOverCurrent,
    dropRef,
  };
}

export default useDropMonitor;
