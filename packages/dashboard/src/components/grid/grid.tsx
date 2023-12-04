import React, { PropsWithChildren } from 'react';
import { DASHBOARD_CONTAINER_ID } from './getDashboardPosition';

import './grid.css';

/**
 *
 * @param width number of columns in dashboard
 * @param height number of rows in dashboard
 * @param cellSize the size of a single square grid section in the dashboard
 * @returns css styling for dashboard dimensions
 *
 * Adds an additional cell to height and width because we add a gutter around the
 * dashboard which is half a cell in size.
 *
 */
const getDashboardDimensionStyles = ({
  width,
  height,
  cellSize,
}: {
  width: number;
  height: number;
  cellSize: number;
}) => ({
  width: `${(width + 1) * cellSize}px`,
  height: `${(height + 1) * cellSize}px`,
});

/**
 *
 * @param cellSize the size of a single square grid section in the dashboard
 * @returns css styling for the dotted grid background
 *
 * Offset the position of the grid background by half a cell to align it correctly
 * based on the half cell sized gutter
 *
 */
const getGridBackgroundDimensionStyles = (cellSize: number) => ({
  backgroundSize: `${cellSize}px ${cellSize}px`,
  right: `-${cellSize * 0.5}px`,
  top: `${cellSize * 0.5}px`,
});

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
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex={0}
    className={`container ${highlighted ? 'grid-container-border-highlighted' : ''}`}
    style={{
      ...getDashboardDimensionStyles({ height, width, cellSize }),
    }}
  >
    {showGuides && (
      <div
        className='grid-image'
        style={{
          ...getGridBackgroundDimensionStyles(cellSize),
        }}
      />
    )}
    {children}
  </div>
);
