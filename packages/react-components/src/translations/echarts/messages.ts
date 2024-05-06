import { Messages } from '../types';

export type EchartsMessageKeys =
  | 'echarts.toolbox.features.dataZoom.title.zoom'
  | 'echarts.toolbox.features.dataZoom.title.back';

export const Echarts: Messages<EchartsMessageKeys> = {
  en: {
    'echarts.toolbox.features.dataZoom.title.zoom': 'Zoom',
    'echarts.toolbox.features.dataZoom.title.back': 'Undo\nzoom',
  },
} as const;
