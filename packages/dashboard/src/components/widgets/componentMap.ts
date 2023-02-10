import {
  BarChart,
  Kpi,
  LineChart,
  ScatterChart,
  StatusGrid,
  StatusTimeline,
  Table,
} from '@iot-app-kit/react-components';
import TextWidget from './primitives/text';
import InputWidget from './primitives/input';

import { ComponentTag } from '../../types';

// eslint-disable-next-line
export const ComponentMap: { [key in ComponentTag]: any } = {
  text: TextWidget,
  input: InputWidget,
  'iot-bar-chart': BarChart,
  'iot-kpi': Kpi,
  'iot-line-chart': LineChart,
  'iot-scatter-chart': ScatterChart,
  'iot-status-grid': StatusGrid,
  'iot-status-timeline': StatusTimeline,
  'iot-table': Table,
};
