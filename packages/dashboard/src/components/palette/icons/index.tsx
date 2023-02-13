import React from 'react';

import { ComponentTag } from '../../../types';

import { BarComponent } from './bar-component';
import { GridComponent } from './grid-component';
import { KpiComponent } from './kpi-component';
import { LineComponent } from './line-component';
import { ScatterComponent } from './scatter-component';
import { TableComponent } from './table-component';
import { TimelineComponent } from './timeline-component';

import './index.css';
import TextComponent from './text-component';
import InputComponent from './input-component';

const IconMap: { [key in ComponentTag]: React.FC } = {
  'iot-bar-chart': BarComponent,
  'iot-status-grid': GridComponent,
  'iot-kpi': KpiComponent,
  'iot-line-chart': LineComponent,
  'iot-scatter-chart': ScatterComponent,
  'iot-table': TableComponent,
  'iot-status-timeline': TimelineComponent,
  text: TextComponent,
  input: InputComponent,
};

type PaletteComponentIconProps = {
  icon: ComponentTag;
};

const PaletteComponentIcon: React.FC<PaletteComponentIconProps> = ({ icon }) => {
  const Icon = IconMap[icon];

  return <Icon />;
};

export default PaletteComponentIcon;
