import { memo, type PropsWithChildren, type ReactNode } from 'react';
import styled from 'styled-components';
import { type PanelOrientation } from './store';
import { useOrientation } from './useOrientation';

export interface DashboardPanelProps extends PropsWithChildren {
  type: string;
  header: ReactNode;
}

export const DashboardPanel = memo(function ({
  type,
  header,
  children,
}: DashboardPanelProps) {
  const [orientation] = useOrientation();

  return (
    <StyledDashboardPanel orientation={orientation} type={type}>
      {header}
      <PanelContent>{children}</PanelContent>
    </StyledDashboardPanel>
  );
});

const StyledDashboardPanel = styled.div<{
  type: string;
  orientation: PanelOrientation;
}>`
  height: 100%;
  border-right: ${(props) =>
    props.orientation === 'left' ? 'var(--dashboard-border)' : 0};
  border-left: ${(props) =>
    props.orientation === 'right' ? 'var(--dashboard-border)' : 0};
  border-top: ${(props) =>
    props.orientation === 'bottom' ? 'var(--dashboard-border)' : 0};

  // create anchor point for resource explorer footer
  position: relative;

  // TODO: understand how to decouple
  padding-bottom: ${({ type }) => (type === 'resource' ? '60px' : undefined)};
`;

const PanelContent = styled.div`
  // fill space of parent
  height: 100%;
  // prevent further collapse of content
  min-width: 300px;
  min-height: 300px;
  overflow: auto;
`;
