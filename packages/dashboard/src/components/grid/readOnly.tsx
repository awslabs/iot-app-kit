import { type PropsWithChildren } from 'react';
import { SizedGrid } from './sizedGrid';

export interface ReadOnlyGridProps extends PropsWithChildren {
  width: number;
  height: number;
  cellSize: number;
}

export const ReadOnlyGrid = ({
  width,
  height,
  cellSize,
  children,
}: ReadOnlyGridProps) => (
  <SizedGrid
    highlighted={false}
    showGuides={false}
    width={width}
    height={height}
    cellSize={cellSize}
    children={children}
  />
);
