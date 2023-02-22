import { isEmpty } from 'lodash';
import React, { ReactNode, useCallback, useState } from 'react';

import { getGlobalSettings } from '../../../common/GlobalSettings';

import {
  Icon,
  SubMenuIconContainer,
  ToolbarItemContainer,
  ToolbarItemIcon,
  ToolbarItemMenu,
  ToolbarItemText,
} from './styledComponents';
import { ToolbarItemOptions, ToolbarItemOrientation, ToolbarItemType } from './types';

interface ToolbarItemContainerProps {
  item: ToolbarItemOptions;
  type: ToolbarItemType;
  children?: ReactNode;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
  orientation?: ToolbarItemOrientation;
  onItemClick?: (item: ToolbarItemOptions) => void;
  disableSelectedStyle?: boolean;
}

// Solves forwardRef with props and eslint issue. Explictly setting the props type (twice) silences eslint
// error "'XXX' is missing in props validation." See https://stackoverflow.com/a/66948051
export const ItemContainer = React.forwardRef<HTMLDivElement, ToolbarItemContainerProps>(
  (
    {
      children,
      item,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerUp,
      orientation,
      onItemClick,
      type,
      disableSelectedStyle,
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
        onItemClick?.(item);
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

    if (item.feature) {
      const featureEnabled = getGlobalSettings().featureConfig[item.feature.name];
      if (!featureEnabled) {
        return null;
      }
    }

    return (
      <ToolbarItemContainer
        isDisabled={item.isDisabled}
        isSelected={!disableSelectedStyle && item.isSelected}
        onPointerDown={pointerDown}
        onPointerEnter={pointerEnter}
        onPointerLeave={pointerLeave}
        onPointerUp={pointerUp}
        data-testid={item.uuid}
        ref={ref}
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
          <ToolbarItemMenu isOpen={hoveredItemId === item.uuid} orientation={orientation}>
            {item.subItems?.map((subItem) => {
              return (
                <ItemContainer
                  key={subItem.uuid}
                  onPointerDown={onPointerDown}
                  onPointerEnter={onPointerEnter}
                  onPointerLeave={onPointerLeave}
                  onPointerUp={onPointerUp}
                  onItemClick={onItemClick}
                  item={subItem}
                  type={type}
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
