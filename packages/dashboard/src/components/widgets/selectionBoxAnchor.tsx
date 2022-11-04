import React from 'react';
import { gestureable } from '../internalDashboard/determineTargetGestures';

import './selectionBoxAnchor.css';

export type Anchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right' | 'top' | 'bottom';

const CORNERS: Anchor[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const SIDES: Anchor[] = ['top', 'right', 'bottom', 'left'];

export type SelectionBoxAnchorProps = {
  anchor: Anchor;
};

const SelectionBoxAnchor: React.FC<SelectionBoxAnchorProps> = ({ anchor }) => {
  const isCorner = CORNERS.includes(anchor);
  const isSide = SIDES.includes(anchor);
  const cornerClass = isCorner ? `selection-box-corner selection-box-corner-${anchor}` : '';
  const sideClass = isSide ? `selection-box-side selection-box-side-${anchor}` : '';
  const anchorClass = `${cornerClass} ${sideClass}`;

  return <div {...gestureable('resize')} className={anchorClass} />;
};

export default SelectionBoxAnchor;
