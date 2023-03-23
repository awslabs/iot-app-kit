import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { CornerTriangleSvg } from '../../../assets/svgs';

import { ItemContainer } from './ItemContainer';
import { CornerAdornment, ToolbarItemMenu } from './styledComponents';
import { ToolbarItemOptions, ToolbarItemOrientation, ToolbarItemType } from './types';

interface ToolbarItemProps<T extends ToolbarItemOptions> {
  items: T[];
  type: ToolbarItemType;
  initialSelectedItem?: T;
  onClick?: (item: T) => void;
  orientation?: ToolbarItemOrientation;
}

export function ToolbarItem<T extends ToolbarItemOptions>({
  initialSelectedItem,
  items,
  onClick,
  orientation,
  type,
}: ToolbarItemProps<T>) {
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem ?? items[0]);
  const [showMenu, setShowMenu] = useState<boolean>();
  const itemContainerRef = useRef<HTMLDivElement | null>(null);

  function handleItemClick(item: T) {
    type === 'mode-select' && setSelectedItem(item);
    onClick?.(item);
  }

  useEffect(() => {
    initialSelectedItem && setSelectedItem(initialSelectedItem);
  }, [initialSelectedItem]);

  useEffect(() => {
    items.length === 1 && setSelectedItem(items[0]);
  }, [items]);

  // When using a touch device, hide ToolbarItemMenu if clicking somewhere outside of it
  useEffect(() => {
    function handlePointerDown({ target }: Event) {
      if (showMenu && (!target || !itemContainerRef.current?.contains(target as HTMLDivElement))) {
        setShowMenu(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showMenu]);

  const menuItemComponents: JSX.Element[] | undefined = useMemo(() => {
    if (items.length > 1) {
      return items.reduce<JSX.Element[]>((accum, item, index) => {
        if ((type === 'action-select' && index > 0) || type !== 'action-select') {
          accum.push(
            <ItemContainer
              key={item.uuid}
              onItemClick={handleItemClick as (item: ToolbarItemOptions) => void}
              onPointerUp={() => {
                setShowMenu(false);
              }}
              item={item}
              type={type}
            />,
          );
        }

        return accum;
      }, []);
    }
    return undefined;
  }, [items, setShowMenu, handleItemClick, type]);

  return selectedItem ? (
    <ItemContainer
      onPointerDown={({ pointerType }) => {
        if (pointerType !== 'mouse' && type !== 'button') {
          setShowMenu(true);
        }
      }}
      onPointerEnter={({ pointerType }) => {
        if (pointerType === 'mouse' && type !== 'button') {
          setShowMenu(true);
        }
      }}
      onPointerLeave={({ pointerType }) => {
        if (pointerType === 'mouse' && type !== 'button') {
          setShowMenu(false);
        }
      }}
      onPointerUp={() => {
        type === 'button' && handleItemClick(selectedItem);
      }}
      item={{ ...selectedItem, text: undefined }} // don't display text for first level toolbar item
      type={type}
      disableSelectedStyle
      ref={itemContainerRef}
    >
      {type !== 'button' && menuItemComponents && (
        <Fragment>
          <CornerAdornment>{CornerTriangleSvg}</CornerAdornment>
          <ToolbarItemMenu isOpen={showMenu} orientation={orientation}>
            {menuItemComponents}
          </ToolbarItemMenu>
        </Fragment>
      )}
    </ItemContainer>
  ) : null;
}
