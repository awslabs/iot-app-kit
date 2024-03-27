import styled, { css } from 'styled-components';
import { Box, Icon as PolarisIcon } from '@cloudscape-design/components';
import {
  colorBackgroundDropdownItemDefault,
  colorBackgroundDropdownItemHover,
  colorBackgroundItemSelected,
  colorBorderDividerDefault,
  colorTextHeadingDefault,
} from '@cloudscape-design/design-tokens';

import { ToolbarItemIconProps, ToolbarItemOptions, ToolbarItemOrientation, ToolbarMenuPosition } from './types';

const DEFAULT_TEXT_PADDING = 20;
const ITEM_DIVIDER_WIDTH = 1;
const GROUP_DIVIDER_WIDTH = 3;

export const CornerAdornment = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16%;
  height: 16%;
  pointer-events: none;
  z-index: 1;
  color: ${colorTextHeadingDefault};
  > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(90deg);
  }
`;

export const Icon = styled(PolarisIcon)<ToolbarItemIconProps>`
  shape-rendering: geometricPrecision;
  transform: ${({ scale = 1 }) => css`scale(${scale});`};
  transform: ${({ scale = 1, isMirrored }) => isMirrored && css`scaleX(${-scale});`};
`;

export const TOOLBAR_ITEM_CONTAINER_HEIGHT = 40;

export const ToolbarItemContainer = styled.div<
  Pick<ToolbarItemOptions, 'isDisabled' | 'isSelected'> & { height?: string; isVertical?: boolean }
>`
  flex: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 40px;
  height: ${({ height }) => height || `${TOOLBAR_ITEM_CONTAINER_HEIGHT}px`};
  text-decoration: none;
  cursor: ${({ isDisabled, isSelected }) => (isDisabled || isSelected ? 'default' : 'pointer')};
  pointer-events: ${({ isDisabled, isSelected }) => (isDisabled || isSelected ? 'none' : 'initial')};
  background-color: ${({ isSelected }) => (isSelected ? colorBackgroundItemSelected : undefined)};
  border-top: ${({ isVertical }) => (isVertical ? `${ITEM_DIVIDER_WIDTH}px solid ${colorBorderDividerDefault}` : '')};
  border-left: ${({ isVertical }) => (!isVertical ? `${ITEM_DIVIDER_WIDTH}px solid ${colorBorderDividerDefault}` : '')};

  &:hover {
    background-color: ${({ isDisabled, isSelected }) => !isDisabled && !isSelected && colorBackgroundDropdownItemHover};
  }

  &:first-of-type {
    border-top: 0;
    border-left: 0;
  }
`;

export const ToolbarItemGroup = styled.div<{
  isVertical: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: ${({ isVertical }) => (isVertical ? 'column' : 'row')};
  border-top: ${({ isVertical }) => (isVertical ? `${GROUP_DIVIDER_WIDTH}px solid ${colorBorderDividerDefault}` : '')};
  border-left: ${({ isVertical }) =>
    !isVertical ? `${GROUP_DIVIDER_WIDTH}px solid ${colorBorderDividerDefault}` : ''};

  &:first-of-type {
    border-top: 0;
    border-left: 0;
  }
`;

export const ToolbarItemIcon = styled.div<ToolbarItemIconProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
`;

export const ToolbarItemMenu = styled.div<{
  isOpen?: boolean;
  orientation?: ToolbarItemOrientation;
  position: ToolbarMenuPosition;
}>`
  display: none;
  position: absolute;
  left: ${({ position }) => {
    if (position === 'right') {
      return '100%';
    } else if (position === 'bottom-left') {
      return '0';
    } else {
      return undefined;
    }
  }};
  right: ${({ position }) => (position === 'bottom-right' ? '0' : undefined)};
  top: ${({ position }) => (position === 'right' ? '0' : '100%')};
  flex-direction: ${({ orientation }) => (orientation === 'horizontal' ? 'row' : 'column')};
  background-color: ${colorBackgroundDropdownItemDefault};
  box-shadow: ${({ theme }) => theme.boxShadow};
  user-select: none;
  z-index: 1;

  ${({ orientation }) => {
    if (orientation === 'horizontal') {
      return `
        & > div {
          border-left: 1px solid ${colorBorderDividerDefault};
          &:first-of-type {
            border-left: 0;
          }
        }
      `;
    } else {
      return `
        & > div {
          border-top: 1px solid ${colorBorderDividerDefault};
          &:first-of-type {
            border-top: 0;
          }
        }
      `;
    }
  }}

  ${({ isOpen }) => {
    return isOpen ? `display: flex; cursor: default;` : '';
  }}
`;

export const ToolbarItemText = styled(Box)<{ leftPadding?: number; rightPadding?: number }>`
  padding: 0 ${({ rightPadding = DEFAULT_TEXT_PADDING }) => rightPadding}px 0
    ${({ leftPadding = DEFAULT_TEXT_PADDING }) => leftPadding}px;
  white-space: nowrap;
`;

export const SubMenuIconContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 6px;
`;
