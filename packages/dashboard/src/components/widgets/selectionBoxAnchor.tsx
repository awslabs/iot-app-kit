import React from 'react';
import {
  anchorable,
  gestureable,
} from '../internalDashboard/gestures/determineTargetGestures';
import './selectionBoxAnchor.css';
import type { Anchor } from '~/store/actions';
import WidgetActions from './widgetActions';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';

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
  const selectedWidgets = useSelectedWidgets();
  const widget = selectedWidgets[0];

  const isCorner = CORNERS.includes(anchor);
  const isSide = SIDES.includes(anchor);
  const cornerClass = isCorner
    ? `selection-box-corner selection-box-corner-${anchor}`
    : '';
  const sideClass = isSide
    ? `selection-box-side selection-box-side-${anchor}`
    : '';
  const anchorClass = `${cornerClass} ${sideClass}`;

  const isTop = anchor === 'top';

  return (
    <>
      {isTop && selectedWidgets?.length === 1 && (
        <WidgetActions widget={widget} />
      )}
      <div
        {...gestureable('resize')}
        {...anchorable(anchor)}
        className={anchorClass}
      />
    </>
  );
};

export default SelectionBoxAnchor;
