import React from 'react';

import map from 'lodash/map';
import includes from 'lodash/includes';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';

import { DashboardConfiguration, Widget } from '../../types';

import './list.css';
import WidgetComponent from './widget';
import SelectionBox from './selectionBox';
import { DashboardMessages } from '../../messages';

export type WidgetsProps = {
  query?: SiteWiseQuery;
  dashboardConfiguration: DashboardConfiguration;
  selectedWidgets: Widget[];
  cellSize: number;
  messageOverrides: DashboardMessages;
};

const Widgets: React.FC<WidgetsProps> = ({
  dashboardConfiguration,
  selectedWidgets,
  cellSize,
  messageOverrides,
  query,
}) => {
  const { widgets, viewport } = dashboardConfiguration;
  const isSelected = (id: string) =>
    includes(
      map(selectedWidgets, (sw) => sw.id),
      id
    );
  return (
    <div
      className="widgets"
      style={{
        margin: `${cellSize / 2}px`,
      }}
    >
      <SelectionBox {...{ selectedWidgets, cellSize }} />
      {widgets.map((widget) => (
        <WidgetComponent
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
