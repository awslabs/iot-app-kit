import React from 'react';
import { Grid, GridProps } from './grid';
import { AutoCellSize } from './autoCellSize';

export type SizedGridProps = GridProps & { stretchToFit: boolean };

/**
 *
 * Wrapper component to be used where we want to render a Grid.
 *
 * Consumed by the editor dashboard and readonly dashboard.
 *
 * It will correctly apply the HOC AutoCellSize if stretchToFit
 * is enabled which will mutate the cell size on element resize.
 * Because of that, AutoCellSize registers additional listeners so we do not
 * want to use it if we don't have to.
 *
 */
export const SizedGrid: React.FC<SizedGridProps> = ({
  stretchToFit,
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
  return stretchToFit ? <AutoCellSize cellSize={cellSize} width={width} children={gridComponent} /> : gridComponent;
};
