import React, { PropsWithChildren } from 'react';
import { SizedGrid } from './sizedGrid';

export type ReadOnlyGridProps = PropsWithChildren<{
  stretchToFit: boolean;
  width: number;
  height: number;
  cellSize: number;
}>;
export const ReadOnlyGrid: React.FC<ReadOnlyGridProps> = ({ width, height, cellSize, stretchToFit, children }) => (
  <SizedGrid
    highlighted={false}
    showGuides={false}
    width={width}
    height={height}
    cellSize={cellSize}
    stretchToFit={stretchToFit}
    children={children}
  />
);
