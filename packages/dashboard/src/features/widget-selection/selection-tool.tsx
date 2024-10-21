import React from 'react';
import styled from 'styled-components';
import type { Rect } from '~/types';
import { useLayers } from '../layers/use-layers';

export interface SelectionToolProps {
  rect: Rect | undefined;
}

export function SelectionTool({ rect }: SelectionToolProps) {
  const { userSelectionLayer } = useLayers();

  return rect ? (
    <SelectionRectangle {...rect} layer={userSelectionLayer} />
  ) : null;
}

const SelectionRectangle = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
  layer: number;
}>`
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  z-index: ${({ layer }) => layer};
  border: var(--selection-border-width) solid var(--selection-color);
`;
