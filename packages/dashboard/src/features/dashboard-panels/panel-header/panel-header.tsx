import React, { memo, type PropsWithChildren } from 'react';
import styled from 'styled-components';
import { ClosePanelButton } from './close-panel-button';
import { PanelOrientationButton } from './panel-orientation-button';

export type PanelHeaderProps = PropsWithChildren;

export const PanelHeader = memo(({ children }: PanelHeaderProps) => {
  return (
    <PanelHeaderContainer>
      <PanelHeaderHeading>{children}</PanelHeaderHeading>
      <ButtonGroup>
        <PanelOrientationButton />
        <ClosePanelButton />
      </ButtonGroup>
    </PanelHeaderContainer>
  );
});

const PanelHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: var(--dashboard-border);
  justify-content: space-between;
  padding: 8px 4px 8px 16px;
`;

const PanelHeaderHeading = styled.h4`
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ButtonGroup = styled.div`
  display: flex;
`;
