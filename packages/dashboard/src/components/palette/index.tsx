import React from 'react';
import { DashboardMessages } from '../../messages';
import { ComponentTag } from '../../types';
import PaletteComponent from './component';

import './index.css';

export type ComponentPaletteProps = {
  messageOverrides: DashboardMessages;
};

export const ComponentPaletteOrdering: [
  keyof DashboardMessages['toolbar']['componentLibrary']['widgets'],
  ComponentTag
][] = [
  ['line', 'iot-line-chart'],
  ['scatter', 'iot-scatter-chart'],
  ['bar', 'iot-bar-chart'],
  ['timeline', 'iot-status-timeline'],
  ['kpi', 'iot-kpi'],
  ['status', 'iot-status-grid'],
  ['table', 'iot-table'],
  ['text', 'text'],
  ['input', 'input'],
];

const Palette: React.FC<ComponentPaletteProps> = ({ messageOverrides }) => {
  return (
    <div>
      <h1 className='iot-dashboard-toolbar-title'>{messageOverrides.toolbar.componentLibrary.title}</h1>
      <div className='component-palette'>
        {ComponentPaletteOrdering.map(([name, componentTag]) => (
          <PaletteComponent
            key={name + componentTag}
            {...{ name: messageOverrides.toolbar.componentLibrary.widgets[name], componentTag }}
          />
        ))}
      </div>
    </div>
  );
};

export default Palette;
