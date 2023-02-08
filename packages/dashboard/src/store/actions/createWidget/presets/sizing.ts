import { ComponentTag, Widget } from '../../../../types';

/**
 * Because the dashboard grid variables can change, these presets are defined in real pixel sizes.
 * They are the minimum height and width that look good for each widget when shown in a zero state.
 */
export const WidgetSizePresets: { [key in ComponentTag]: Pick<Widget, 'width' | 'height'> } = {
  text: {
    height: 50,
    width: 150,
  },
  'iot-bar-chart': {
    height: 150,
    width: 270,
  },
  'iot-kpi': {
    height: 120,
    width: 270,
  },
  'iot-line-chart': {
    height: 150,
    width: 270,
  },
  'iot-scatter-chart': {
    height: 150,
    width: 270,
  },
  'iot-status-grid': {
    height: 180,
    width: 270,
  },
  'iot-status-timeline': {
    height: 170,
    width: 270,
  },
  'iot-table': {
    height: 170,
    width: 270,
  },
};
