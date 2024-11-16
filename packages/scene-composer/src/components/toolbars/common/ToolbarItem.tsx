import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { CornerTriangleSvg } from '../../../assets/svgs';

import { ItemContainer } from './ItemContainer';
import { CornerAdornment, ToolbarItemMenu } from './styledComponents';
import {
  type ToolbarItemOptions,
  type ToolbarItemOrientation,
  type ToolbarItemType,
  type ToolbarMenuPosition,
} from './types';

interface MenuItemsContainterProps {
  maxHeight?: string;
  children: React.ReactNode;
}

const MenuItemsContainter = ({ maxHeight, children }: MenuItemsContainterProps) => {
  return <div style={{ overflowY: 'auto', maxHeight: maxHeight }}>{children}</div>;
};

interface ToolbarItemProps<T extends ToolbarItemOptions> {
  items: T[];
  type: ToolbarItemType;
  initialSelectedItem?: T;
  onSelect?: (item: T) => void;
  orientation?: ToolbarItemOrientation;
  isVertical?: boolean;
  menuPosition?: ToolbarMenuPosition;
  // Only used by the first root menu item
  menuHeight?: string;
  maxMenuContainerHeight?: number | undefined;
}

export function ToolbarItem<T extends ToolbarItemOptions>({
  initialSelectedItem,
  items,
  onSelect,
  orientation,
  type,
  menuPosition = 'right',
  menuHeight,
  maxMenuContainerHeight,
  isVertical,
}: ToolbarItemProps<T>) {
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem ?? items[0]);
  const [showMenu, setShowMenu] = useState<boolean>();
  const itemContainerRef = useRef<HTMLDivElement | null>(null);
  // refs used to trap focus on menu items
  const firstItemRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const isItemFirst = (index: number) => {
    return (type === 'action-select' && index === 1) || (type !== 'action-select' && index === 0);
  };

  const isItemLast = (index: number) => {
    return index === items.length - 1;
  };

  const getFirstOrLastItemRef = (index: number) => {
    if (isItemFirst(index)) {
      return firstItemRef;
    } else if (isItemLast(index)) {
      return lastItemRef;
    }
    return null;
  };

  const handleItemClick = (item: T) => {
    type === 'mode-select' && setSelectedItem(item);
    onSelect?.(item);
  };

  const handleItemKeyDown = (item: T, e, focusIndex?: number) => {
    if (e.key === 'Enter') {
      setShowMenu(true);
      type === 'mode-select' && setSelectedItem(item);
      onSelect?.(item);
    }
    // if not a submenu item, return
    if (focusIndex === undefined) {
      return;
    }
    if (showMenu) {
      if (e.key === 'Escape') {
        itemContainerRef.current?.focus();
        setShowMenu(false);
      } else if (e.key === 'Tab' && !e.shiftKey && isItemLast(focusIndex) && firstItemRef.current) {
        e.preventDefault(); // prevent tab from changing focus
        firstItemRef.current.focus();
      } else if (e.key === 'Tab' && e.shiftKey && isItemFirst(focusIndex) && lastItemRef.current) {
        e.preventDefault(); // prevent tab + shift from changing focus
        lastItemRef.current.focus();
      }
    }
  };

  useEffect(() => {
    initialSelectedItem && setSelectedItem(initialSelectedItem);
  }, [initialSelectedItem]);

  useEffect(() => {
    items.length === 1 && setSelectedItem(items[0]);
  }, [items]);

  useEffect(() => {
    if (showMenu && firstItemRef.current) {
      firstItemRef.current.focus();
    }
  }, [showMenu, firstItemRef]);

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
        const itemRef = getFirstOrLastItemRef(index);
        if ((type === 'action-select' && index > 0) || type !== 'action-select') {
          accum.push(
            <ItemContainer
              key={item.uuid}
              onItemClick={handleItemClick as (item: ToolbarItemOptions) => void}
              onPointerUp={() => {
                setShowMenu(false);
              }}
              onItemKeyDown={(e) => handleItemKeyDown(item, e, index)}
              item={item}
              type={type}
              ref={itemRef}
            />,
          );
        }

        return accum;
      }, []);
    }
    return undefined;
  }, [items, setShowMenu, handleItemClick, handleItemKeyDown, type]);

  return selectedItem ? (
    <ItemContainer
      menuHeight={menuHeight}
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
      onItemKeyDown={(e) => {
        handleItemKeyDown(selectedItem, e);
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
      isVertical={isVertical}
    >
      {type !== 'button' && menuItemComponents && (
        <Fragment>
          <CornerAdornment>{CornerTriangleSvg}</CornerAdornment>
          <ToolbarItemMenu isOpen={showMenu} orientation={orientation} position={menuPosition}>
            <MenuItemsContainter maxHeight={maxMenuContainerHeight ? `${maxMenuContainerHeight}px` : undefined}>
              {menuItemComponents}
            </MenuItemsContainter>
          </ToolbarItemMenu>
        </Fragment>
      )}
    </ItemContainer>
  ) : null;
}
