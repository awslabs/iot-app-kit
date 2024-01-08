import React from 'react';
import { Grid, GridProps } from './grid';

export type SizedGridProps = GridProps;

/**
 *
 * Wrapper component to be used where we want to render a Grid.
 *
 * Consumed by the editor dashboard and readonly dashboard.
 *
 */
export const SizedGrid: React.FC<SizedGridProps> = ({
  width,
  height,
  cellSize,
  showGuides,
  highlighted,
  children,
}) => {
  const gridComponent = (
    <Grid
      width={width}
      height={height}
      showGuides={showGuides}
      highlighted={highlighted}
      cellSize={cellSize}
      children={children}
    />
  );
  return gridComponent;
};
