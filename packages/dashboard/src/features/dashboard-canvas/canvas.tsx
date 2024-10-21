import React, {
  memo,
  useCallback,
  type MouseEvent,
  type PropsWithChildren,
} from 'react';
import styled from 'styled-components';
import { useContextMenu } from '~/features/context-menu/use-context-menu';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useDashboardHeight } from '~/store/dashboard/use-dashboard-height';
import { useDashboardWidth } from '~/store/dashboard/use-dashboard-width';
import {
  DASHBOARD_CONTAINER_ID,
  getDashboardPosition,
} from './getDashboardPosition';
import gridSvg from './grid-dot.svg';

export interface CanvasProps extends PropsWithChildren {
  highlighted: boolean;
  showGrid: boolean;
  showGuides: boolean;
}

export const Canvas = memo(function ({
  showGrid,
  highlighted,
  children,
}: CanvasProps) {
  const [height] = useDashboardHeight();
  const [width] = useDashboardWidth();
  const [cellSize] = useDashboardCellSize();
  const { open } = useContextMenu();

  const handleOpenContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      open(getDashboardPosition(event));
    },
    [open]
  );

  return (
    <CanvasScrollContainer>
      <StyledCanvas
        height={height}
        width={width}
        cellSize={cellSize}
        id={DASHBOARD_CONTAINER_ID}
        tabIndex={0}
        onContextMenu={handleOpenContextMenu}
        showGrid={showGrid}
        highlighted={highlighted}
      >
        {children}
      </StyledCanvas>
    </CanvasScrollContainer>
  );
});

export const CanvasScrollContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: scroll;
`;

const StyledCanvas = styled.div<
  {
    height: number;
    width: number;
    cellSize: number;
  } & Pick<CanvasProps, 'highlighted' | 'showGrid'>
>`
  // set dimensions of the canvas based on dashboard configuration
  width: ${({ width, cellSize }) => `${(width + 1) * cellSize}px`};
  height: ${({ height, cellSize }) => `${(height + 1) * cellSize}px`};
  // provide anchor point for positioning children
  position: relative;
  // create a new stacking context to contain children
  z-index: 0;

  background-color: #f8f8f8;

  ${({ highlighted }) =>
    highlighted &&
    `
      box-shadow: 0 0 0 var(--selection-border-width) var(--selection-color) inset;
      transition: box-shadow 50ms;
    `}

  ${({ showGrid, cellSize }) =>
    showGrid &&
    `
      background-image: url(${gridSvg});
      background-repeat: repeat;
      background-size: ${cellSize}px ${cellSize}px;
    `}
`;
