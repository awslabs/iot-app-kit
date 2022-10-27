import React from 'react';

import map from 'lodash/map';
import includes from 'lodash/includes';

import { DashboardConfiguration, Widget } from '../../types';

import './list.css';
import IotWidget from './widget';

export type IotWidgetsProps = {
  dashboardConfiguration: DashboardConfiguration;
  selectedWidgets: Widget[];
  cellSize: number;
};

const IotWidgets: React.FC<IotWidgetsProps> = ({ dashboardConfiguration, selectedWidgets, cellSize }) => {
  const { widgets, viewport } = dashboardConfiguration;
  const isSelected = (id: string) => includes(map(selectedWidgets, sw => sw.id), id);
  return (
    <div
      className='iot-widgets'
    >
      {widgets.map((widget) => (
        <IotWidget
          isSelected={isSelected(widget.id)}
          key={widget.id}
          cellSize={cellSize}
          widget={widget}
          viewport={viewport}
        />
      ))}
    </div>
  )
};

export default IotWidgets;
