import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@cloudscape-design/components/box';
import Button, { ButtonProps } from '@cloudscape-design/components/button';
import {
  colorBorderDividerDefault,
  borderRadiusBadge,
  colorBackgroundContainerContent,
  spaceScaledXxs,
  spaceScaledXs,
  spaceScaledM,
  colorBackgroundButtonPrimaryDefault,
  colorBackgroundButtonNormalDefault,
  spaceStaticXl,
  spaceStaticL,
  spaceStaticXxs,
  spaceStaticXs,
} from '@cloudscape-design/design-tokens';
import {
  CancelableEventHandler,
  ClickDetail,
} from '@cloudscape-design/components/internal/events';
import { getPlugin } from '@iot-app-kit/core';

import { DashboardWidget } from '~/types';
import { useDeleteWidgets } from '~/hooks/useDeleteWidgets';
import ConfirmDeleteModal from '~/components/confirmDeleteModal';
import { DashboardState } from '~/store/state';

import './tile.css';
import { onChangeDashboardGridEnabledAction } from '~/store/actions';
import { CSVDownloadButton } from '~/components/csvDownloadButton';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { useClients } from '~/components/dashboard/clientContext';

type DeletableTileActionProps = {
  handleDelete: CancelableEventHandler<ClickDetail>;
};

const DeletableTileAction = ({
  handleDelete,
  variant,
}: DeletableTileActionProps & ButtonProps) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onMouseDown={handleMouseDown}>
      <Button
        onClick={handleDelete}
        ariaLabel='delete widget'
        variant={variant ?? 'icon'}
        iconName='close'
      />
    </div>
  );
};

export type WidgetTileProps = PropsWithChildren<{
  widget: DashboardWidget;
  title?: string;
}>;

/**
 *
 * Component to add functionality to the widget container
 * Allows a user to title a widget, add click remove
 */
const WidgetTile: React.FC<WidgetTileProps> = ({ children, widget, title }) => {
  const isReadOnly = useSelector((state: DashboardState) => state.readOnly);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const { onDelete } = useDeleteWidgets();
  const metricsRecorder = getPlugin('metricsRecorder');
  const { iotSiteWiseClient } = useClients();
  const selectedWidgets = useSelector(
    (state: DashboardState) => state.selectedWidgets
  );
  const enableActionButtons = !isReadOnly && showActionButtons;
  const headerVisible =
    (!isReadOnly && widget.type !== 'text') || widget.type !== 'text';

  const handleDelete: CancelableEventHandler<ClickDetail> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(onChangeDashboardGridEnabledAction({ enabled: false }));
    setVisible(true);
  };

  const handleCloseModal = () => {
    dispatch(onChangeDashboardGridEnabledAction({ enabled: true }));
    setVisible(false);
  };

  const handleSubmit = () => {
    const widgetType = widget.type;
    onDelete(widget);
    dispatch(onChangeDashboardGridEnabledAction({ enabled: true }));
    setVisible(false);

    metricsRecorder?.record({
      contexts: {
        widgetType,
      },
      metricName: 'DashboardWidgetDelete',
      metricValue: 1,
    });
  };

  const toggleActionButtons = useCallback(() => {
    if (selectedWidgets && selectedWidgets.find((w) => w.id === widget.id))
      setShowActionButtons(true);
    else setShowActionButtons(false);
  }, [selectedWidgets, widget.id]);

  const handleOnMouseLeave = () => {
    toggleActionButtons();
  };

  useEffect(() => {
    toggleActionButtons();
  }, [toggleActionButtons]);

  return (
    <div
      aria-description='widget tile'
      className='widget-tile'
      style={{
        border: `2px solid ${colorBorderDividerDefault}`,
        borderRadius: borderRadiusBadge,
        backgroundColor: colorBackgroundContainerContent,
      }}
      onMouseEnter={() => setShowActionButtons(true)}
      onMouseLeave={handleOnMouseLeave}
    >
      {enableActionButtons && (
        <div
          className='tile-button-container'
          style={{
            padding: `${spaceStaticXxs} ${spaceStaticXs}`,
            height: `${spaceStaticXl}`,
            right: `${spaceStaticL}`,
            borderRadius: `${spaceStaticXxs}`,
            border: `2px solid ${colorBackgroundButtonPrimaryDefault}`,
            backgroundColor: `${colorBackgroundButtonNormalDefault}`,
          }}
        >
          {widget.type !== 'text' && iotSiteWiseClient && (
            <CSVDownloadButton
              variant='inline-icon'
              fileName={`${widget.properties.title ?? widget.type}`}
              client={iotSiteWiseClient}
              widgetType={widget.type}
              queryConfig={
                widget.properties.queryConfig as StyledSiteWiseQueryConfig
              }
            />
          )}
          <DeletableTileAction
            variant='inline-icon'
            handleDelete={handleDelete}
          />
          <ConfirmDeleteModal
            visible={visible}
            headerTitle='Delete selected widget?'
            cancelTitle='Cancel'
            submitTitle='Delete'
            description={
              <Box>
                <Box variant='p'>
                  Are you sure you want to delete the selected widget? You'll
                  lose all the progress you made to the widget
                </Box>
                <Box variant='p' padding={{ top: 'm' }}>
                  You cannot undo this action.
                </Box>
              </Box>
            }
            handleDismiss={handleCloseModal}
            handleCancel={handleCloseModal}
            handleSubmit={handleSubmit}
          />
        </div>
      )}

      {headerVisible && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: `${spaceScaledXs} ${spaceScaledXs} ${spaceScaledXxs} ${spaceScaledM}`,
            borderBottom: `2px solid ${colorBorderDividerDefault}`,
          }}
        >
          <div className='widget-tile-header' title={title}>
            <Box variant='h1' fontSize='body-m'>
              {title}
            </Box>
          </div>

          {isReadOnly && widget.type !== 'text' && iotSiteWiseClient && (
            <div className='preview-button-container'>
              <CSVDownloadButton
                variant='icon'
                fileName={`${widget.properties.title ?? widget.type}`}
                client={iotSiteWiseClient}
                widgetType={widget.type}
                queryConfig={
                  widget.properties.queryConfig as StyledSiteWiseQueryConfig
                }
              />
            </div>
          )}
        </div>
      )}
      <div className='widget-tile-body'>{children}</div>
    </div>
  );
};

export default WidgetTile;
