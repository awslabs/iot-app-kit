import React from 'react';

import map from 'lodash/map';
import includes from 'lodash/includes';

import { DashboardConfiguration, Widget } from '../../types';

import './list.css';
import WidgetComponent from './widget';
import SelectionBox from './selectionBox';

export type WidgetsProps = {
  dashboardConfiguration: DashboardConfiguration;
  selectedWidgets: Widget[];
  cellSize: number;
};

const Widgets: React.FC<WidgetsProps> = ({ dashboardConfiguration, selectedWidgets, cellSize }) => {
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
      <SelectionBox {...{ dashboardConfiguration, selectedWidgets, cellSize }} />
      {widgets.map((widget) => (
        <WidgetComponent
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
