import { Button, Checkbox } from '@awsui/components-react';
import React, { ComponentPropsWithRef, FC, ReactNode, useCallback } from 'react';

export type SelectionMode = 'single' | 'multi';

interface TreeItemInnerProps {
  selected?: boolean;
  selectable?: boolean;
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
  selectable = true,
  selected = false,
  className = '',
  onActivated = () => {},
}) => {
  const toggle = useCallback(
    (e) => {
      onSelected(!selected, e);
    },
    [selected, onSelected],
  );

  return (
    <div
      className={`tm-tree-item-inner${selected ? ' selected' : ''} ${className}`.trimEnd()}
      onClick={toggle}
      onDoubleClick={onActivated}
      aria-selected={selected}
    >
      {selectable && (
        <Checkbox checked={selected} onChange={toggle}>
          {children}
        </Checkbox>
      )}
      {!selectable && children}
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
      selectable,
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
        <TreeItemInner selected={selected} selectable={selectable} onActivated={onActivated} onSelected={onSelected}>
          {expandable && (
            <Button
              className='tm-tree-item-expand-btn'
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
