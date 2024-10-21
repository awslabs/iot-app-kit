import {
  borderRadiusDropdown,
  colorBackgroundControlDisabled,
  colorBackgroundDropdownItemDefault,
  colorBackgroundDropdownItemHover,
  colorBorderControlDefault,
  colorTextBodyDefault,
  spaceScaledL,
  spaceScaledXs,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import styled from 'styled-components';

export const Container = styled.div.attrs(() => ({
  role: 'menu',
  'aria-label': 'Context menu',
}))<{ x: number; y: number }>`
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  z-index: 10000;

  position: absolute;
  border: ${spaceScaledXxxs} solid ${colorBorderControlDefault};
  width: 192px; // 128+64, just picking a width which is a multiple of 8
  border-radius: ${borderRadiusDropdown};
  background-color: ${colorBackgroundDropdownItemDefault};
  color: ${colorTextBodyDefault};
`;

export const Options = styled.ul`
  padding: 0;
  margin: calc(${spaceScaledXxxs} * -1);
  display: flex;
  flex-direction: column;
  list-style: none;
`;

export const Option = styled.li.attrs(() => ({ role: 'menuitem' }))<{
  'aria-label': string;
}>`
  border: ${spaceScaledXxxs} solid rgba(0, 0, 0, 0);
  display: flex;
  justify-content: space-between;
  padding: 0;
  line-height: ${spaceScaledL};
  border-radius: ${borderRadiusDropdown};
`;

interface ContextMenuOptionButtonProps {
  disabled: boolean;
  'aria-label': string;
}

export const OptionButton = styled.button.attrs<ContextMenuOptionButtonProps>(
  ({ disabled }) => ({
    'aria-disabled': disabled,
  })
)<ContextMenuOptionButtonProps>`
  background-color: transparent;
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: ${spaceScaledXs} ${spaceScaledL};
  line-height: ${spaceScaledL};
  border-radius: ${borderRadiusDropdown};
  border: ${spaceScaledXxxs} solid rgba(0, 0, 0, 0);

  ${({ disabled }) =>
    disabled &&
    `
      color: ${colorBackgroundControlDisabled};
      cursor: not-allowed;
    `}

  ${({ disabled }) =>
    !disabled &&
    `
      &:hover {
        background-color: ${colorBackgroundDropdownItemHover};
        border: ${spaceScaledXxxs} solid ${colorBorderControlDefault};
        cursor: pointer;
      }
    `}
`;
