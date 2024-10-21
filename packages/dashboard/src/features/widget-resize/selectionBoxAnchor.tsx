import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';
import React from 'react';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import type { Anchor } from '~/store/dashboard/reducer';
import {
  anchorable,
  gestureable,
} from '../../dashboard/internalDashboard/gestures/determineTargetGestures';
import WidgetActions from '../widgets/widgetActions';
import './selectionBoxAnchor.css';

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
  const cornerStyle = isCorner
    ? { backgroundColor: colorBackgroundContainerContent }
    : {};
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
        style={cornerStyle}
      />
    </>
  );
};

export default SelectionBoxAnchor;
