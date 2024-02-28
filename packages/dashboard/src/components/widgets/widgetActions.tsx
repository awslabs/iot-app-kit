import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlugin } from '@iot-app-kit/core';

import {
  colorBackgroundButtonPrimaryDefault,
  colorBackgroundButtonNormalDefault,
  spaceStaticXl,
  spaceStaticL,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import {
  CancelableEventHandler,
  ClickDetail,
} from '@cloudscape-design/components/internal/events';
import { Box, Button, ButtonProps } from '@cloudscape-design/components';

import {
  CSVDownloadButton,
  canOnlyDownloadLiveMode,
  isQueryEmpty,
} from '../csvDownloadButton';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import ConfirmDeleteModal from '../confirmDeleteModal';
import { useClients } from '../dashboard/clientContext';
import { useDeleteWidgets } from '~/hooks/useDeleteWidgets';
import { DashboardWidget } from '~/types';

import {
  onChangeDashboardGridEnabledAction,
  onSelectWidgetsAction,
} from '~/store/actions';
import { DashboardState } from '~/store/state';

import './widgetActions.css';

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

const WidgetActions = ({ widget }: { widget: DashboardWidget }) => {
  const dispatch = useDispatch();
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );
  const { iotSiteWiseClient } = useClients();
  const { onDelete } = useDeleteWidgets();
  const metricsRecorder = getPlugin('metricsRecorder');
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const [visible, setVisible] = useState(false);

  const handleDelete: CancelableEventHandler<ClickDetail> = (e) => {
    e.stopPropagation();
    dispatch(onChangeDashboardGridEnabledAction({ enabled: false }));
    dispatch(onSelectWidgetsAction({ widgets: [widget], union: false }));
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

  const isEmptyQuery =
    widget.type !== 'text' &&
    isQueryEmpty(widget.properties.queryConfig as StyledSiteWiseQueryConfig);
  const cannotDownload = canOnlyDownloadLiveMode.some((t) => t === widget.type);

  if (readOnly && (isEmptyQuery || cannotDownload)) return <></>;

  return (
    <div
      className='widget-actions-container'
      aria-label='widget-actions-container'
      style={{
        padding: `${spaceStaticXxxs} ${spaceStaticXs}`,
        height: `${spaceStaticXl}`,
        right: `${spaceStaticL}`,
        borderRadius: `${spaceStaticXs}`,
        border: `2px solid ${colorBackgroundButtonPrimaryDefault}`,
        backgroundColor: `${colorBackgroundButtonNormalDefault}`,
        pointerEvents: 'auto',
      }}
    >
      {!isEdgeModeEnabled && widget.type !== 'text' && iotSiteWiseClient && (
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
      {!readOnly && (
        <DeletableTileAction
          variant='inline-icon'
          handleDelete={handleDelete}
        />
      )}
      <ConfirmDeleteModal
        visible={visible}
        headerTitle='Delete selected widget?'
        cancelTitle='Cancel'
        submitTitle='Delete'
        description={
          <Box>
            <Box variant='p'>
              Are you sure you want to delete the selected widget? You'll lose
              all the progress you made to the widget
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
  );
};

export default WidgetActions;
