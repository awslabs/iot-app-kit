import React from 'react';
import { DashboardMessages } from '../../messages';
import { ComponentTag } from '../../types';
import PaletteComponent from './component';

import './index.css';

export type ComponentPaletteProps = {
  messageOverrides: DashboardMessages;
};

export const ComponentPaletteOrdering: [string, ComponentTag][] = [
  ['Line', 'iot-line-chart'],
  ['Scatter', 'iot-scatter-chart'],
  ['Bar', 'iot-bar-chart'],
  ['Timeline', 'iot-status-timeline'],
  ['Kpi', 'iot-kpi'],
  ['Grid', 'iot-status-grid'],
  ['Table', 'iot-table'],
  ['Text', 'text'],
];

const Palette: React.FC<ComponentPaletteProps> = ({ messageOverrides }) => {
  return (
    <div>
      <h1 className="component-palette-title">{messageOverrides.toolbar.componentLibrary}</h1>
      <div className="component-palette">
        {ComponentPaletteOrdering.map(([name, componentTag]) => (
          <PaletteComponent key={name + componentTag} {...{ name, componentTag }} />
        ))}
      </div>
    </div>
  );
};

export default Palette;
