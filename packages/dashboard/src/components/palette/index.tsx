import React from 'react';
import { DashboardMessages } from '../../messages';
import PaletteComponent from './component';

import './index.css';

export type ComponentPaletteProps = {
  messageOverrides: DashboardMessages;
};

const Palette: React.FC<ComponentPaletteProps> = ({ messageOverrides }) => {
  return (
    <div>
      <h1 className="component-palette-title">{messageOverrides.toolbar.componentLibrary}</h1>
      <div className="component-palette">
        <PaletteComponent name="Line" componentTag="iot-line-chart" />
        <PaletteComponent name="Scatter" componentTag="iot-scatter-chart" />
        <PaletteComponent name="Bar" componentTag="iot-bar-chart" />
        <PaletteComponent name="Timeline" componentTag="iot-status-timeline" />
        <PaletteComponent name="Kpi" componentTag="iot-kpi" />
        <PaletteComponent name="Grid" componentTag="iot-status-grid" />
        <PaletteComponent name="Table" componentTag="iot-table" />
      </div>
    </div>
  );
};

export default Palette;
