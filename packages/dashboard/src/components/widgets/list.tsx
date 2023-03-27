import React from 'react';

import map from 'lodash/map';
import includes from 'lodash/includes';
import WidgetComponent from './widget';
import SelectionBox from './selectionBox';
import './list.css';
import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { DashboardWidgetsConfiguration, DashboardWidget } from '~/types';
import type { DashboardMessages } from '~/messages';

export type WidgetsProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  dashboardConfiguration: DashboardWidgetsConfiguration;
  selectedWidgets: DashboardWidget[];
  cellSize: number;
  dragEnabled: boolean;
  messageOverrides: DashboardMessages;
};

const Widgets: React.FC<WidgetsProps> = ({
  dashboardConfiguration,
  selectedWidgets,
  cellSize,
  dragEnabled,
  messageOverrides,
  query,
  readOnly,
}) => {
  const { widgets, viewport } = dashboardConfiguration;
  const isSelected = (id: string) =>
    includes(
      map(selectedWidgets, (sw) => sw.id),
      id
    );

  return (
    <div
      className='widgets'
      style={{
        margin: `${cellSize / 2}px`,
      }}
    >
      {!readOnly && <SelectionBox selectedWidgets={selectedWidgets} cellSize={cellSize} dragEnabled={dragEnabled} />}
      {widgets.map((widget) => (
        <WidgetComponent
          readOnly={readOnly}
          query={query}
          messageOverrides={messageOverrides}
          isSelected={isSelected(widget.id)}
          key={widget.id}
          cellSize={cellSize}
          widget={widget}
          viewport={viewport}
        />
      ))}
    </div>
  );
};

export default Widgets;
