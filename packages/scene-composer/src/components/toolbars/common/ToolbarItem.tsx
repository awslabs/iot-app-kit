import React, { Fragment, ReactNode, useEffect, useRef, useState } from 'react';

import { CornerTriangleSvg } from '../../../assets/svgs';
import { getGlobalSettings } from '../../../common/GlobalSettings';

import {
  CornerAdornment,
  Icon,
  ToolbarItemContainer,
  ToolbarItemIcon,
  ToolbarItemMenu,
  ToolbarItemText,
} from './styledComponents';
import { FeatureDefinition, ToolbarItemOptions } from './types';

interface ToolbarItemProps<T extends ToolbarItemOptions> {
  items: T | T[];
  type: 'button' | 'action-select' | 'mode-select';
  initialSelectedItem?: T;
  isDisabled?: boolean;
  onClick?: (item: T) => void;
  orientation?: 'horizontal' | 'vertical';
}

interface ToolbarItemContainerProps extends ToolbarItemOptions {
  children?: ReactNode;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
  feature?: FeatureDefinition;
}

// Solves forwardRef with props and eslint issue. Explictly setting the props type (twice) silences eslint
// error "'XXX' is missing in props validation." See https://stackoverflow.com/a/66948051
const ItemContainer = React.forwardRef<HTMLDivElement, ToolbarItemContainerProps>(
  (
    {
      children,
      icon,
      isDisabled,
      isSelected,
      label,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerUp,
      text,
      uuid,
      feature,
    }: ToolbarItemContainerProps,
    ref,
  ) => {
    if (feature) {
      const featureEnabled = getGlobalSettings().featureConfig[feature.name];
      if (!featureEnabled) {
        return null;
      }
    }
    return (
      <ToolbarItemContainer
        isDisabled={isDisabled}
        isSelected={isSelected}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        data-testid={uuid}
        ref={ref}
      >
        {icon && (
          <ToolbarItemIcon>
            <span role='img' aria-label={label} title={label}>
              <Icon {...icon} variant={isDisabled ? 'disabled' : 'normal'} />
            </span>
          </ToolbarItemIcon>
        )}
        {text && (
          <ToolbarItemText
            color={isDisabled ? 'text-status-inactive' : 'inherit'}
            leftPadding={icon ? 0 : undefined}
            variant='small'
          >
            {text}
          </ToolbarItemText>
        )}
        {children}
      </ToolbarItemContainer>
    );
  },
);

export function ToolbarItem<T extends ToolbarItemOptions>({
  initialSelectedItem,
  isDisabled,
  items,
  onClick,
  orientation,
  type,
}: ToolbarItemProps<T>) {
  const [selectedItem, setSelectedItem] = useState(initialSelectedItem ?? (Array.isArray(items) ? items[0] : items));
  const [showMenu, setShowMenu] = useState<boolean>();
  const itemContainerRef = useRef<HTMLDivElement | null>(null);

  function handleItemClick(item: T) {
    onClick && onClick(item);
  }

  useEffect(() => {
    initialSelectedItem && setSelectedItem(initialSelectedItem);
  }, [initialSelectedItem]);

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

  if (selectedItem) {
    const { text, ...selectedItemProps } = selectedItem;
    let subItems: JSX.Element[] | undefined;

    if (Array.isArray(items) && items.length > 1) {
      subItems = items.reduce<JSX.Element[]>((accum, item, index) => {
        if ((type === 'action-select' && index > 0) || type !== 'action-select') {
          accum.push(
            <ItemContainer
              isDisabled={item.isDisabled}
              isSelected={item === selectedItem}
              key={item.uuid}
              onPointerUp={() => {
                type === 'mode-select' && setSelectedItem(item);
                handleItemClick(item);
                setShowMenu(false);
              }}
              {...item}
            />,
          );
        }

        return accum;
      }, []);
    }

    return (
      <ItemContainer
        isDisabled={isDisabled || selectedItem.isDisabled}
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
        {...selectedItemProps}
        ref={itemContainerRef}
      >
        {type !== 'button' && subItems && (
          <Fragment>
            <CornerAdornment>{CornerTriangleSvg}</CornerAdornment>
            <ToolbarItemMenu isOpen={showMenu} orientation={orientation}>
              {subItems}
            </ToolbarItemMenu>
          </Fragment>
        )}
      </ItemContainer>
    );
  }

  return null;
}
