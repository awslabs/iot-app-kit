import Box from '@cloudscape-design/components/box';
import Button, { type ButtonProps } from '@cloudscape-design/components/button';
import {
  colorBackgroundButtonNormalDefault,
  colorBackgroundButtonPrimaryDefault,
  spaceStaticL,
  spaceStaticXl,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import { getPlugin } from '@iot-app-kit/core';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { useDeleteWidgets } from '~/hooks/useDeleteWidgets';
import type { StyledSiteWiseQueryConfig } from '~/plugins/xy-plot/types';
import {
  onChangeDashboardGridEnabledAction,
  onSelectWidgetsAction,
} from '~/store/actions';
import { type DashboardState } from '~/store/state';
import { ConfirmDeleteModal } from '~/components/confirmDeleteModal';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import {
  canOnlyDownloadLiveMode,
  CSVDownloadButton,
  isQueryEmpty,
} from '../csvDownloadButton';
import { useClients } from '../dashboard/clientContext';
import './widgetActions.css';

export interface DeletableTileActionProps extends ButtonProps {
  handleDelete: NonNullable<ButtonProps['onClick']>;
}

export const DeletableTileAction = ({
  handleDelete,
  variant,
}: DeletableTileActionProps) => {
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

export interface WidgetActionsProps<Type extends RegisteredWidgetType> {
  widget: WidgetInstance<Type>;
}

export const WidgetActions = <Type extends RegisteredWidgetType>({
  widget,
}: WidgetActionsProps<Type>) => {
  const dispatch = useDispatch();
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );
  const { iotSiteWiseClient } = useClients();
  const { onDelete } = useDeleteWidgets();
  const metricsRecorder = getPlugin('metricsRecorder');
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const [visible, setVisible] = useState(false);

  const handleDelete: NonNullable<ButtonProps['onClick']> = (e) => {
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

  if (readOnly && (isEmptyQuery || cannotDownload || isEdgeModeEnabled))
    return <></>;

  return (
    <div
      className='widget-actions-container'
      aria-label='widget-actions-container'
      style={{
        margin: `${spaceStaticXxxs} ${spaceStaticXs}`,
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
          fileName={`${widget.properties.title ?? widget.type}`}
          client={iotSiteWiseClient}
          widgetType={widget.type}
          queryConfig={
            widget.properties.queryConfig as StyledSiteWiseQueryConfig
          }
        />
      )}
      {!readOnly && (
        <DeletableTileAction variant='icon' handleDelete={handleDelete} />
      )}
      <ConfirmDeleteModal
        visible={visible}
        headerTitle='Delete selected widget?'
        cancelTitle='Cancel'
        submitTitle='Delete'
        description={
          <Box>
            <Box variant='p'>
              Do you want to delete the selected widget? All changes will be
              lost.
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
