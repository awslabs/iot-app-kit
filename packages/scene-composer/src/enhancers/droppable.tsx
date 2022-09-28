import { TargetType } from 'dnd-core';
import React, { ForwardRefExoticComponent, useCallback } from 'react';

import useDropMonitor from '../hooks/useDropMonitor';

export interface DroppableProps {
  droppable?: boolean;
  acceptDrop: TargetType;
  onDropped(item: any, meta: any);
  className?: string;
}

function droppable<TProps, TBaseElement>(
  Component: ForwardRefExoticComponent<TProps & React.RefAttributes<TBaseElement>>,
) {
  const DroppableComponent = React.forwardRef<TBaseElement, DroppableProps & TProps>(
    ({ acceptDrop, onDropped: onDrop, className = '', droppable = true, ...props }: DroppableProps & TProps, ref) => {
      const { isOverCurrent, dropRef } = useDropMonitor(acceptDrop, onDrop);

      const mergeRef = useCallback(
        (node) => {
          let result = ref ? (ref as Function)(node) : node;
          result = dropRef(result);
          return result;
        },
        [dropRef, ref],
      );

      if (droppable) {
        return (
          <Component
            ref={mergeRef}
            className={`${className} ${isOverCurrent ? 'drop' : ''}`.trim()}
            {...(props as unknown as TProps)}
          />
        );
      }

      return <Component ref={ref} className={className} {...(props as unknown as TProps)} />;
    },
  );

  DroppableComponent.displayName = `droppable(${Component.displayName || 'unknown'})`;
  return DroppableComponent;
}

export default droppable;
