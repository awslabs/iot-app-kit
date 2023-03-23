import styled, { css } from 'styled-components';
import { Box, Icon as PolarisIcon } from '@awsui/components-react';
import {
  colorBackgroundDropdownItemDefault,
  colorBackgroundDropdownItemHover,
  colorBackgroundItemSelected,
  colorBorderDividerDefault,
  colorTextHeadingDefault,
} from '@awsui/design-tokens';

import { ToolbarItemIconProps, ToolbarItemOptions } from './types';

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

export const ToolbarItemContainer = styled.div<Pick<ToolbarItemOptions, 'isDisabled' | 'isSelected'>>`
  flex: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 40px;
  height: 40px;
  text-decoration: none;
  cursor: ${({ isDisabled, isSelected }) => (isDisabled || isSelected ? 'default' : 'pointer')};
  pointer-events: ${({ isDisabled, isSelected }) => (isDisabled || isSelected ? 'none' : 'initial')};
  background-color: ${({ isSelected }) =>
    isSelected ? colorBackgroundItemSelected : colorBackgroundDropdownItemDefault};
  border-top: ${ITEM_DIVIDER_WIDTH}px solid ${colorBorderDividerDefault};

  &:hover {
    background-color: ${({ isDisabled, isSelected }) => !isDisabled && !isSelected && colorBackgroundDropdownItemHover};
  }

  &:first-of-type {
    border-top: 0;
  }
`;

export const ToolbarItemGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-top: ${GROUP_DIVIDER_WIDTH}px solid ${colorBorderDividerDefault};

  &:first-of-type {
    border-top: 0;
  }
`;

export const ToolbarItemIcon = styled.div<ToolbarItemIconProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

export const ToolbarItemMenu = styled.div<{
  isOpen?: boolean;
  orientation?: 'horizontal' | 'vertical';
}>`
  display: none;
  position: absolute;
  left: 100%;
  top: 0;
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
