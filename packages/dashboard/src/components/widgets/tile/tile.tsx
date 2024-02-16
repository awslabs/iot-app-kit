import React, { PropsWithChildren } from 'react';
import {
  colorBorderDividerDefault,
  borderRadiusBadge,
  colorBackgroundContainerContent,
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
      {(widget.type === 'bar-chart' || widget.type === 'status-timeline') && (
        <Box
          padding={{ horizontal: 's', top: 'xs' }}
          color='text-body-secondary'
          fontSize='heading-m'
          fontWeight='bold'
        >
          <div className='widget-tile-header'>{title}</div>
        </Box>
      )}
      <div className='widget-tile-body'>{children}</div>
    </div>
  );
};

export default WidgetTile;
