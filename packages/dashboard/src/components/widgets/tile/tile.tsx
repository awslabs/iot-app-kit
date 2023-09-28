import React, { PropsWithChildren, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import {
  colorBorderDividerDefault,
  borderRadiusBadge,
  colorBackgroundContainerContent,
  spaceScaledXxs,
  spaceScaledXs,
  spaceScaledM,
} from '@cloudscape-design/design-tokens';
import { CancelableEventHandler, ClickDetail } from '@cloudscape-design/components/internal/events';

import { DashboardWidget } from '~/types';
import { DashboardState } from '~/store/state';
import { useDeleteWidgets } from '~/hooks/useDeleteWidgets';

import './tile.css';
import { onChangeDashboardGridEnabledAction } from '~/store/actions';
import { gestureable } from '~/components/internalDashboard/gestures/determineTargetGestures';

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
  const dispatch = useDispatch();

  const isRemoveable = !isReadOnly && removeable;
  const headerVisible = !isReadOnly || title;

  const disableGridMovement = (_event: SyntheticEvent) => {
    dispatch(onChangeDashboardGridEnabledAction({ enabled: false }));
  };

  const enableGridMovement = (_event: SyntheticEvent) => {
    dispatch(onChangeDashboardGridEnabledAction({ enabled: true }));
  };

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: `${spaceScaledXs} ${spaceScaledXs} ${spaceScaledXxs} ${spaceScaledM}`,
            borderBottom: `2px solid ${colorBorderDividerDefault}`,
          }}
          {...gestureable('moveable')}
        >
          <Box variant='h1' fontSize='body-m'>
            {title}
          </Box>
          <SpaceBetween size='s' direction='horizontal'>
            {isRemoveable && <DeletableTileAction widget={widget} />}
          </SpaceBetween>
        </div>
      )}
      <div className='widget-tile-body' onPointerEnter={disableGridMovement} onPointerLeave={enableGridMovement}>
        {children}
      </div>
    </div>
  );
};

export default WidgetTile;
