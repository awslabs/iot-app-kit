import { Button, Checkbox } from '@awsui/components-react';
import React, { ComponentPropsWithRef, FC, ReactNode, useCallback } from 'react';

export type SelectionMode = 'single' | 'multi';

interface TreeItemInnerProps {
  selected?: boolean;
  className?: string;
  onActivated?(): Promise<void> | void;
  onSelected?(newState: boolean, e?: any): Promise<void> | void;
}

export interface TreeItemProps extends TreeItemInnerProps, ComponentPropsWithRef<'li'> {
  labelText: ReactNode;
  selectionMode?: SelectionMode;

  // Expandable
  expandable?: boolean;
  expanded?: boolean;
  onExpand?<TEvent>(newState: boolean, e: TEvent): void | Promise<void>;
}

const TreeItemInner: FC<TreeItemInnerProps> = ({
  children,
  onSelected = /* istanbul ignore next */ () => {},
  selected = false,
  className = '',
  onActivated = () => {},
}) => {
  return (
    <div
      className={`tm-tree-item-inner${selected ? ' selected' : ''} ${className}`.trimEnd()}
      onClick={(e) => onSelected(!selected, e)}
      onDoubleClick={onActivated}
      aria-selected={selected}
    >
      <Checkbox checked={selected}>{children}</Checkbox>
    </div>
  );
};

TreeItemInner.displayName = 'TreeItemInner';

const TreeItem = React.forwardRef<HTMLLIElement, TreeItemProps>(
  (
    {
      className = '',
      labelText,
      children,
      selected,
      onActivated,
      onSelected,
      selectionMode = 'single',
      expandable,
      expanded,
      onExpand = () => {},
      ...props
    }: TreeItemProps,
    ref,
  ) => {
    const expandHandler = useCallback(
      async (e) => {
        e.stopPropagation(); // Prevent bubbling that would result in triggering selected.
        await onExpand(!expanded, e);
      },
      [onExpand, expanded],
    );

    return (
      <li
        ref={ref}
        className={`tm-tree-item${expandable ? ' expandable' : ''} ${className}`.trim()}
        role='treeitem'
        {...props}
      >
        <TreeItemInner selected={selected} onActivated={onActivated} onSelected={onSelected}>
          {expandable && (
            <Button
              variant='inline-icon'
              onClick={expandHandler}
              iconName={`treeview-${expanded ? 'collapse' : 'expand'}`}
            />
          )}
          {labelText}
        </TreeItemInner>
        {!expandable || (expandable && expanded) ? children : null}
      </li>
    );
  },
);

TreeItem.displayName = 'TreeItem';

export default TreeItem;
