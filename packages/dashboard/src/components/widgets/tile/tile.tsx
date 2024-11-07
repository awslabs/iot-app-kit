import { Box, Checkbox, SpaceBetween } from '@cloudscape-design/components';
import {
  borderRadiusBadge,
  colorBackgroundContainerContent,
  colorBackgroundControlChecked,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import type { AssistantProperty } from '@iot-app-kit/react-components';
import { type PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HorizontalDivider } from '~/components/divider/horizontalDivider';
import {
  onAssistantDeselectWidgetsAction,
  onAssistantSelectWidgetsAction,
} from '~/store/actions';
import type { DashboardState } from '~/store/state';
import { type DashboardWidget } from '~/types';
import './tile.css';

export type WidgetTileProps = PropsWithChildren<{
  widget: DashboardWidget;
  assistant?: AssistantProperty;
  title?: string;
}>;

const WidgetTypeSelectionEnabled = ['kpi', 'gauge'];
/**
 *
 * Component to add functionality to the widget container
 * Allows a user to title a widget for bar and status-timeline
 */
const WidgetTile: React.FC<WidgetTileProps> = ({
  title,
  widget,
  assistant,
  children,
}) => {
  const dispatch = useDispatch();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const assistantState = useSelector(
    (state: DashboardState) => state.assistant
  );

  const isSelected =
    typeof assistantState.selectedQueries.find(
      (item) => item.widgetId === widget.id
    ) !== 'undefined' && WidgetTypeSelectionEnabled.includes(widget.type);

  const handleWidgetSelection = () => {
    if (isSelected) {
      dispatch(
        onAssistantDeselectWidgetsAction({
          widgetId: widget.id,
        })
      );
    } else {
      dispatch(
        onAssistantSelectWidgetsAction({
          widgetId: widget.id,
          widgetType: widget.type,
          selectedProperties: 1,
        })
      );
    }
  };

  const titleComponentWithoutBorder = title ? (
    <div
      style={{
        paddingBottom: spaceScaledXs,
      }}
    >
      <Box
        padding={{ horizontal: 's', top: 'xs' }}
        fontSize='heading-s'
        fontWeight='bold'
      >
        <div className='widget-tile-header'>{title}</div>
      </Box>
    </div>
  ) : null;

  const isSelectionAvailable =
    readOnly &&
    assistant &&
    assistantState.state !== 'DISABLED' &&
    assistantState.mode === 'on';
  WidgetTypeSelectionEnabled.includes(widget.type);

  return (
    <div
      aria-description='widget tile'
      className='widget-tile'
      style={{
        height: isSelected ? 'calc(100% + 10px)' : 'inherit',
        borderRadius: borderRadiusBadge,
        backgroundColor: colorBackgroundContainerContent,
        border: isSelected ? `2px solid ${colorBackgroundControlChecked}` : '',
      }}
    >
      {isSelectionAvailable ? (
        <Box padding={{ top: 'xxs' }}>
          <SpaceBetween size='xxs' alignItems='end' direction='vertical'>
            <Box padding={{ bottom: 'xxs', right: 'xxs' }}>
              <Checkbox
                onChange={() => handleWidgetSelection()}
                checked={isSelected}
              />
            </Box>
          </SpaceBetween>
          <HorizontalDivider styles={{ height: '1px' }} />
        </Box>
      ) : null}
      <div className='widget-tile-body'>
        {titleComponentWithoutBorder}
        {children}
      </div>
    </div>
  );
};

export default WidgetTile;
