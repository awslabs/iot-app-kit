import React from 'react';
import { Grid, GridProps } from './grid';
import { AutoCellSize } from './autoCellSize';

export type SizedGridProps = GridProps & { stretchToFit: boolean };

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
  return stretchToFit ? <AutoCellSize width={width} children={gridComponent} /> : gridComponent;
};
