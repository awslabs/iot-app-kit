import { type PropsWithChildren } from 'react';
import { SizedGrid } from './sizedGrid';

export type ReadOnlyGridProps = PropsWithChildren<{
  width: number;
  height: number;
  cellSize: number;
}>;
export const ReadOnlyGrid: React.FC<ReadOnlyGridProps> = ({
  width,
  height,
  cellSize,
  children,
}) => (
  <SizedGrid
    highlighted={false}
    showGuides={false}
    width={width}
    height={height}
    cellSize={cellSize}
    children={children}
  />
);
