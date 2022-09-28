import React, { ForwardRefExoticComponent, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import './draggable.scss';

export interface DraggableProps {
  dataType: string;
  data: {};
  draggable?: boolean;
  className?: string;
}

const draggable = function <TProps, TBaseElement>(
  Component: ForwardRefExoticComponent<TProps & React.RefAttributes<TBaseElement>>,
) {
  const DraggableComponent = React.forwardRef<TBaseElement, DraggableProps & TProps>(
    // eslint-disable-next-line react/prop-types
    ({ draggable = true, dataType, data, className = '', ...props }, ref) => {
      const [collected, dragRef] = useDrag(() => ({
        type: dataType,
        item: data,
        collect: (monitor) => {
          return {
            isDragging: monitor.isDragging(),
          };
        },
      }));

      const mergeRef = useCallback(
        (node) => {
          let result = ref ? (ref as Function)(node) : node;
          result = dragRef(result);
          return result;
        },
        [dragRef, ref],
      );

      if (draggable) {
        return !collected.isDragging ? (
          <Component
            ref={mergeRef}
            className={`tm-draggable ${className}`.trim()}
            draggable
            {...(props as unknown as TProps)}
          />
        ) : null;
      }

      return <Component ref={ref} className={`tm-draggable ${className}`.trim()} {...(props as unknown as TProps)} />;
    },
  );

  DraggableComponent.displayName = `draggable(${Component.displayName || 'unknown'})`;
  return DraggableComponent;
};

export default draggable;
