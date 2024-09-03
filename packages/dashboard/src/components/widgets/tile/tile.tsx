import React, { PropsWithChildren } from 'react';
import {
  borderRadiusBadge,
  colorBackgroundContainerContent,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import { Box } from '@cloudscape-design/components';

import { DashboardWidget } from '~/types';

import './tile.css';

export type WidgetTileProps = PropsWithChildren<{
  widget: DashboardWidget;
  title?: string;
}>;

/**
 *
 * Component to add functionality to the widget container
 * Allows a user to title a widget for bar and status-timeline
 */
const WidgetTile: React.FC<WidgetTileProps> = ({ widget, title, children }) => {
  const titleComponentWithoutBorder = title ? (
    <div
      style={{
        paddingBottom: spaceScaledXs,
      }}
    >
      <Box
        padding={{ horizontal: 's', top: 'xs' }}
        color='text-body-secondary'
        fontSize='heading-m'
        fontWeight='bold'
      >
        <div className='widget-tile-header'>{title}</div>
      </Box>
    </div>
  ) : null;

  // temporary solution for fixing title
  // once gestures are correctly handled, we can move
  // the title back into the react-components
  const widgetsWithTitle = ['gauge', 'xy-plot', 'bar-chart', 'status-timeline'];

  return (
    <div
      aria-description='widget tile'
      className='widget-tile'
      style={{
        borderRadius: borderRadiusBadge,
        backgroundColor: colorBackgroundContainerContent,
      }}
    >
      <div className='widget-tile-body'>
        {widgetsWithTitle.includes(widget.type) && titleComponentWithoutBorder}
        {children}
      </div>
    </div>
  );
};

export default WidgetTile;
