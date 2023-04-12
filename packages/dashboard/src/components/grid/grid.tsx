import React, { PropsWithChildren } from 'react';
import { DASHBOARD_CONTAINER_ID } from './getDashboardPosition';

import './grid.css';

export type GridProps = PropsWithChildren<{
  highlighted: boolean;
  width: number;
  height: number;
  cellSize: number;
  showGuides: boolean;
}>;
export const Grid: React.FC<GridProps> = ({ highlighted, showGuides, width, height, cellSize, children }) => (
  <div
    id={DASHBOARD_CONTAINER_ID}
    tabIndex={0}
    className={`container ${highlighted ? 'grid-container-border-highlighted' : ''}`}
    style={{
      width: `${(width + 1) * cellSize}px`,
      height: `${(height + 1) * cellSize}px`,
    }}
  >
    {showGuides && (
      <div
        className='grid-image'
        style={{
          backgroundSize: `${cellSize}px ${cellSize}px`,
          right: `-${cellSize * 0.5}px`,
          top: `${cellSize * 0.5}px`,
        }}
      />
    )}
    {children}
  </div>
);
