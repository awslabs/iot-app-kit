import React from 'react';

import map from 'lodash/map';
import includes from 'lodash/includes';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';

import { DashboardConfiguration, Widget } from '~/types';
import WidgetComponent from './widget';
import SelectionBox from './selectionBox';
import { DashboardMessages } from '~/messages';

import './list.css';

export type WidgetsProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  dashboardConfiguration: DashboardConfiguration;
  selectedWidgets: Widget[];
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
      <SelectionBox {...{ selectedWidgets, cellSize, dragEnabled }} />
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
