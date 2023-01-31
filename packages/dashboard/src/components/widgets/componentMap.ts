import {
  BarChart,
  Kpi,
  LineChart,
  ScatterChart,
  Status,
  StatusTimeline,
  Table,
} from '@iot-app-kit/react-components';
import TextWidget from './primitives/text';

import { ComponentTag } from '../../types';

// eslint-disable-next-line
export const ComponentMap: { [key in ComponentTag]: any } = {
  text: TextWidget,
  'iot-bar-chart': BarChart,
  'iot-kpi': Kpi,
  'iot-line-chart': LineChart,
  'iot-scatter-chart': ScatterChart,
  'iot-status-grid': Status,
  'iot-status-timeline': StatusTimeline,
  'iot-table': Table,
};
