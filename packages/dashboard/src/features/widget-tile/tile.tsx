import { Box } from '@cloudscape-design/components';
import {
  borderRadiusBadge,
  colorBackgroundContainerContent,
  colorBorderDividerDefault,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import React, { PropsWithChildren } from 'react';

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
export const WidgetTile: React.FC<WidgetTileProps> = ({
  widget,
  title,
  children,
}) => {
  const titleComponentWithBorder = (
    <div
      style={{
        borderBottom: `2px solid ${colorBorderDividerDefault}`,
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
  );

  // temporary solution for fixing title
  // once gestures are correctly handled, we can move
  // the title back into the react-components
  const widgetsWithTitle = ['gauge', 'xy-plot', 'bar-chart', 'status-timeline'];

  return (
    <div
      aria-description='widget tile'
      className='widget-tile'
      style={{
        border: `2px solid ${colorBorderDividerDefault}`,
        borderRadius: borderRadiusBadge,
        backgroundColor: colorBackgroundContainerContent,
      }}
    >
      {widgetsWithTitle.includes(widget.type) && titleComponentWithBorder}
      <div className='widget-tile-body'>{children}</div>
    </div>
  );
};
