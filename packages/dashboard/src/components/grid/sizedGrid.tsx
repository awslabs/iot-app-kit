import { Grid, type GridProps } from './grid';

export type SizedGridProps = GridProps;

/**
 * Wrapper component to be used where we want to render a Grid.
 */
export const SizedGrid = ({
  width,
  height,
  cellSize,
  showGuides,
  highlighted,
  children,
}: SizedGridProps) => {
  return (
    <Grid
      width={width}
      height={height}
      showGuides={showGuides}
      highlighted={highlighted}
      cellSize={cellSize}
      children={children}
    />
  );
};
