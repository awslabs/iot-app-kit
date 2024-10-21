import CloudscapeIcon, {
  IconProps as CloudscapeIconProps,
} from '@cloudscape-design/components/icon';
import React, { useCallback, type PropsWithChildren } from 'react';
import styled from 'styled-components';
import { type EditMode, type ViewMode } from '~/features/dashboard-mode';
import { useStoreDispatch, useStoreSelector } from '~/store';
import { closePanel, openPanel, PanelState } from '../panel-store';

export interface PanelToggleButtonProps<Mode extends ViewMode | EditMode> {
  title: string;
  mode: Mode;
  panelType: PanelState[Mode]['panelType'];
  iconType: NonNullable<CloudscapeIconProps['name']>;
}

export function PanelToggleButton<Mode extends ViewMode | EditMode>({
  title,
  mode,
  panelType,
  iconType,
}: PanelToggleButtonProps<Mode>) {
  const currentPanelType = useStoreSelector(
    (state) => state.panels[mode].panelType
  );
  const dispatch = useStoreDispatch();

  const togglePanel = useCallback(() => {
    if (panelType === currentPanelType) {
      dispatch(closePanel({ mode }));
    } else {
      dispatch(openPanel({ mode, panelType }));
    }
  }, [mode, panelType, currentPanelType, dispatch]);

  return (
    <Button
      title={title}
      isCurrent={panelType === currentPanelType}
      onClick={togglePanel}
    >
      <CloudscapeIcon variant='inverted' name={iconType} />
    </Button>
  );
}

interface PanelControlBarButtonProps extends PropsWithChildren {
  title: string;
  isCurrent: boolean;
  onClick: VoidFunction;
}

const Button = styled.button.attrs<
  Pick<PanelControlBarButtonProps, 'isCurrent'>
>(({ isCurrent }) => ({
  'aria-current': isCurrent,
}))<PanelControlBarButtonProps>`
  background-color: ${({ isCurrent }) => (isCurrent ? '#0972d3' : '#424650')};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  border: 0;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: ${({ isCurrent }) => (isCurrent ? '#033160' : '#656871')};
  }
`;
