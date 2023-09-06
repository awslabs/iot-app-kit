import React, { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Icon from '@cloudscape-design/components/icon';
import {
  colorBorderDividerDefault,
  borderRadiusBadge,
  colorBackgroundContainerContent,
} from '@cloudscape-design/design-tokens';
import { CancelableEventHandler, ClickDetail } from '@cloudscape-design/components/internal/events';

import { DashboardWidget } from '~/types';
import { DashboardState } from '~/store/state';
import { useDeleteWidgets } from '~/hooks/useDeleteWidgets';

import './tile.css';

type DeletableTileActionProps = {
  widget: DashboardWidget;
};
const DeletableTileAction = ({ widget }: DeletableTileActionProps) => {
  const { onDelete } = useDeleteWidgets();

  const handleDelete: CancelableEventHandler<ClickDetail> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(widget);
  };

  return <Button onClick={handleDelete} ariaLabel='delete widget' variant='icon' iconName='close'></Button>;
};

const Divider = () => <div className='horizontal-divider' style={{ backgroundColor: colorBorderDividerDefault }} />;

export type WidgetTileProps = PropsWithChildren<{
  widget: DashboardWidget;
  title?: string;
  removeable?: boolean;
}>;

/**
 *
 * Component to add functionality to the widget container
 * Allows a user to title a widget, add click remove
 */
const WidgetTile: React.FC<WidgetTileProps> = ({ children, widget, title, removeable }) => {
  const isReadOnly = useSelector((state: DashboardState) => state.readOnly);

  const isRemoveable = !isReadOnly && removeable;
  const isResizable = !isReadOnly;
  const headerVisible = !isReadOnly || title;

  return (
    <div
      role='widget'
      aria-description='widget tile'
      className='widget-tile'
      style={{
        border: `2px solid ${colorBorderDividerDefault}`,
        borderRadius: borderRadiusBadge,
        backgroundColor: colorBackgroundContainerContent,
      }}
    >
      {headerVisible && (
        <>
          <Box padding={{ left: 'xs', right: 'xxs', top: 'xxs' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box variant='h1' fontSize='body-m'>
                {title}
              </Box>
              <SpaceBetween size='s' direction='horizontal'>
                {isRemoveable && <DeletableTileAction widget={widget} />}
              </SpaceBetween>
            </div>
          </Box>
          <Divider />
        </>
      )}
      <div className='widget-tile-body'>
        {children}
        {isResizable && (
          <div className='widget-tile-resize-handle'>
            <Icon variant='disabled' name='resize-area' />
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetTile;
