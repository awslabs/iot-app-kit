import React from 'react';
import {
  anchorable,
  gestureable,
} from '../internalDashboard/gestures/determineTargetGestures';
import './selectionBoxAnchor.css';
import type { Anchor } from '~/store/actions';

const CORNERS: Anchor[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];
const SIDES: Anchor[] = ['top', 'right', 'bottom', 'left'];

export type SelectionBoxAnchorProps = {
  anchor: Anchor;
};

const SelectionBoxAnchor: React.FC<SelectionBoxAnchorProps> = ({ anchor }) => {
  const isCorner = CORNERS.includes(anchor);
  const isSide = SIDES.includes(anchor);
  const cornerClass = isCorner
    ? `selection-box-corner selection-box-corner-${anchor}`
    : '';
  const sideClass = isSide
    ? `selection-box-side selection-box-side-${anchor}`
    : '';
  const anchorClass = `${cornerClass} ${sideClass}`;

  return (
    <div
      {...gestureable('resize')}
      {...anchorable(anchor)}
      className={anchorClass}
    />
  );
};

export default SelectionBoxAnchor;
