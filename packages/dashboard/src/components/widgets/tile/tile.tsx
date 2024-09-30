import React, { PropsWithChildren } from 'react';
import {
  borderRadiusBadge,
  colorBackgroundContainerContent,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import { Box, Checkbox } from '@cloudscape-design/components';
import { DashboardWidget } from '~/types';
import { HorizontalDivider } from '~/components/divider/horizontalDivider';
import { useDispatch, useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import type { AssistantProperty } from '@iot-app-kit/react-components';

import './tile.css';
import {
  onAssistantDeselectWidgetsAction,
  onAssistantSelectWidgetsAction,
} from '~/store/actions';
import { SiteWiseQueryConfig } from '~/customization/widgets/types';

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
    ) !== 'undefined';

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
          queryConfig: widget.properties.queryConfig as SiteWiseQueryConfig,
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
        borderRadius: borderRadiusBadge,
        backgroundColor: colorBackgroundContainerContent,
      }}
    >
      {isSelectionAvailable ? (
        <Box padding={{ top: 'xxs' }}>
          <Box padding={{ left: 'xs', bottom: 'xxs' }}>
            <Checkbox
              onChange={() => handleWidgetSelection()}
              checked={isSelected}
            >
              &nbsp;
            </Checkbox>
          </Box>
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
