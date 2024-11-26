import isEmpty from 'lodash-es/isEmpty';
import { forwardRef, type ReactNode, useCallback, useState } from 'react';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import {
  Icon,
  SubMenuIconContainer,
  ToolbarItemContainer,
  ToolbarItemIcon,
  ToolbarItemMenu,
  ToolbarItemText,
} from './styledComponents';
import { type ToolbarItemOptions, type ToolbarItemOrientation, type ToolbarItemType } from './types';

interface ToolbarItemContainerProps {
  item: ToolbarItemOptions;
  type: ToolbarItemType;

  menuHeight?: string;
  children?: ReactNode;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
  onItemKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  orientation?: ToolbarItemOrientation;
  onItemClick?: (item: ToolbarItemOptions) => void;
  disableSelectedStyle?: boolean;
  isVertical?: boolean;
}

// Solves forwardRef with props and eslint issue. Explictly setting the props type (twice) silences eslint
// error "'XXX' is missing in props validation." See https://stackoverflow.com/a/66948051
export const ItemContainer = forwardRef<HTMLDivElement, ToolbarItemContainerProps>(
  (
    {
      children,
      item,
      menuHeight,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerUp,
      onItemKeyDown,
      orientation,
      onItemClick,
      type,
      disableSelectedStyle,
      isVertical,
    }: ToolbarItemContainerProps,
    ref,
  ) => {
    const [hoveredItemId, setHoveredItemId] = useState<string>('');

    const pointerDown = useCallback(
      (e) => {
        if (e.pointerType !== 'mouse' && type !== 'button') {
          setHoveredItemId(item.uuid);
        }
        onPointerDown?.(e);
      },
      [type, item.uuid, onPointerDown],
    );

    const pointerUp = useCallback(
      (e) => {
        onPointerUp?.(e);
        if (!item.isDisabled && onItemClick) {
          onItemClick(item);
        }
        e.stopPropagation();
      },
      [item, onPointerUp],
    );

    const pointerEnter = useCallback(
      (e) => {
        if (e.pointerType === 'mouse' && type !== 'button') {
          setHoveredItemId(item.uuid);
        }
        onPointerEnter?.(e);
      },
      [type, item.uuid, onPointerEnter],
    );

    const pointerLeave = useCallback(
      (e) => {
        if (e.pointerType === 'mouse' && type !== 'button') {
          setHoveredItemId('');
        }
        onPointerLeave?.(e);
      },
      [type, onPointerLeave],
    );

    const keyDown = useCallback(
      (e) => {
        e.stopPropagation();
        if (!item.isDisabled || e.key !== 'Enter') {
          onItemKeyDown?.(e);
        }
      },
      [item, onItemKeyDown],
    );

    if (item.feature) {
      const featureEnabled = getGlobalSettings().featureConfig[item.feature.name];
      if (!featureEnabled) {
        return null;
      }
    }

    return (
      <ToolbarItemContainer
        height={menuHeight}
        isDisabled={item.isDisabled}
        isSelected={!disableSelectedStyle && item.isSelected}
        onPointerDown={pointerDown}
        onPointerEnter={pointerEnter}
        onPointerLeave={pointerLeave}
        onPointerUp={pointerUp}
        onClick={(e) => e.stopPropagation()} // To prevent triggering onClick of parent components unexpectedly
        data-testid={item.uuid}
        ref={ref}
        onKeyDown={keyDown}
        tabIndex={0}
        isVertical={isVertical !== false}
      >
        {item.icon && (
          <ToolbarItemIcon>
            <span role='img' aria-label={item.label} title={item.label}>
              <Icon {...item.icon} variant={item.isDisabled ? 'disabled' : 'normal'} />
            </span>
          </ToolbarItemIcon>
        )}
        {item.text && (
          <ToolbarItemText
            color={item.isDisabled ? 'text-status-inactive' : 'inherit'}
            leftPadding={item.icon ? 0 : undefined}
            variant='small'
          >
            {item.text}
          </ToolbarItemText>
        )}
        {!isEmpty(item.subItems) && (
          <SubMenuIconContainer>
            <Icon name='caret-right-filled' />
          </SubMenuIconContainer>
        )}
        {!isEmpty(item.subItems) && (
          <ToolbarItemMenu isOpen={hoveredItemId === item.uuid} tabIndex={0} orientation={orientation} position='right'>
            {item.subItems?.map((subItem) => {
              return (
                <ItemContainer
                  key={subItem.uuid}
                  onPointerDown={onPointerDown}
                  onPointerEnter={onPointerEnter}
                  onPointerLeave={onPointerLeave}
                  onPointerUp={onPointerUp}
                  onItemClick={onItemClick}
                  onItemKeyDown={onItemKeyDown}
                  item={subItem}
                  type={type}
                  isVertical={isVertical}
                />
              );
            })}
          </ToolbarItemMenu>
        )}

        {children}
      </ToolbarItemContainer>
    );
  },
);
