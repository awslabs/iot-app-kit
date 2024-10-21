import { Button, type ButtonProps } from '@cloudscape-design/components';
import {
  CancelableEventHandler,
  ClickDetail,
} from '@cloudscape-design/components/internal/events';
import {
  colorBackgroundButtonNormalDefault,
  colorBackgroundButtonPrimaryDefault,
  spaceStaticL,
  spaceStaticXl,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import { getPlugin } from '@iot-app-kit/core';
import React from 'react';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import {
  CSVDownloadButton,
  canOnlyDownloadLiveMode,
  isQueryEmpty,
} from '~/features/csv-download';
import { useMode } from '~/features/dashboard-mode';
import { useDeleteWidgets } from '~/features/widget-deletion/use-delete-widgets';
import { useDashboardContext } from '~/services/use-dashboard';
import { DashboardWidget } from '~/types';
import { useClients } from '../../dashboard/clientContext';
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
  const { edgeMode } = useDashboardContext();
  const deleteWidgets = useDeleteWidgets();
  const { mode } = useMode();
  const { iotSiteWiseClient } = useClients();
  const metricsRecorder = getPlugin('metricsRecorder');

  const handleDelete: CancelableEventHandler<ClickDetail> = (e) => {
    e.stopPropagation();
    // dispatch(onChangeDashboardGridEnabledAction({ enabled: false }));
    // dispatch(onSelectWidgetsAction({ widgets: [widget], union: false }));
  };

  const isEmptyQuery =
    widget.type !== 'text' &&
    isQueryEmpty(widget.properties.queryConfig as StyledSiteWiseQueryConfig);
  const cannotDownload = canOnlyDownloadLiveMode.some((t) => t === widget.type);

  if (
    mode === 'view' &&
    (isEmptyQuery || cannotDownload || edgeMode === 'enabled')
  )
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
      {edgeMode !== 'enabled' &&
        widget.type !== 'text' &&
        iotSiteWiseClient && (
          <CSVDownloadButton
            fileName={`${widget.properties.title ?? widget.type}`}
            client={iotSiteWiseClient}
            widgetType={widget.type}
            queryConfig={
              widget.properties.queryConfig as StyledSiteWiseQueryConfig
            }
          />
        )}
      {mode === 'edit' && (
        <DeletableTileAction variant='icon' handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default WidgetActions;
