import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import {
  colorBackgroundButtonNormalDefault,
  colorBackgroundButtonPrimaryDefault,
  spaceStaticL,
  spaceStaticXl,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import {
  type CSSProperties,
  type MouseEvent,
  useCallback,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { useDeleteWidgets } from '~/hooks/useDeleteWidgets';
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

const style = {
  margin: `${spaceStaticXxxs} ${spaceStaticXs}`,
  height: `${spaceStaticXl}`,
  right: `${spaceStaticL}`,
  borderRadius: `${spaceStaticXs}`,
  border: `2px solid ${colorBackgroundButtonPrimaryDefault}`,
  backgroundColor: `${colorBackgroundButtonNormalDefault}`,
  pointerEvents: 'auto',
} satisfies CSSProperties;

export interface WidgetActionsProps<WidgetType extends RegisteredWidgetType> {
  widget: WidgetInstance<WidgetType>;
}

export const WidgetActions = <WidgetType extends RegisteredWidgetType>({
  widget,
}: WidgetActionsProps<WidgetType>) => {
  const dispatch = useDispatch();
  const isEdgeModeEnabled = useSelector(
    (state: DashboardState) => state.isEdgeModeEnabled
  );
  const { iotSiteWiseClient } = useClients();
  const deleteWidgets = useDeleteWidgets();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const [isVisible, setIsVisible] = useState(false);

  const handleDelete = useCallback(() => {
    dispatch(onChangeDashboardGridEnabledAction({ enabled: false }));
    dispatch(onSelectWidgetsAction({ widgets: [widget], union: false }));
    setIsVisible(true);
  }, [widget, dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(onChangeDashboardGridEnabledAction({ enabled: true }));
    setIsVisible(false);
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    deleteWidgets([widget.id]);
    dispatch(onChangeDashboardGridEnabledAction({ enabled: true }));
    setIsVisible(false);
  }, [deleteWidgets, widget.id, dispatch]);

  const isEmptyQuery =
    widget.type !== 'text' &&
    isQueryEmpty(widget.properties.queryConfig?.query);
  const cannotDownload = canOnlyDownloadLiveMode.some((t) => t === widget.type);

  if (readOnly && (isEmptyQuery || cannotDownload || isEdgeModeEnabled))
    return <></>;

  return (
    <div
      className='widget-actions-container'
      aria-label='widget-actions-container'
      style={style}
    >
      {!isEdgeModeEnabled && iotSiteWiseClient && widget.type !== 'text' && (
        <CSVDownloadButton
          fileName={`${widget.properties.title ?? widget.type}`}
          client={iotSiteWiseClient}
          widgetType={widget.type}
          queryConfig={widget.properties.queryConfig}
        />
      )}
      {!readOnly && <DeletableTileAction onClick={handleDelete} />}
      <ConfirmDeleteModal
        visible={isVisible}
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

interface DeletableTileActionProps {
  onClick: VoidFunction;
}

const DeletableTileAction = ({ onClick }: DeletableTileActionProps) => {
  const handleMouseDown = useCallback(
    (e: MouseEvent) => e.stopPropagation(),
    []
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onMouseDown={handleMouseDown}>
      <Button
        onClick={onClick}
        ariaLabel='delete widget'
        variant='icon'
        iconName='close'
      />
    </div>
  );
};
