import * as echarts from 'echarts';
import { type ComponentOption } from 'echarts/types/src/util/types.js';

export interface TrendCursorOption extends ComponentOption {
  group: string;
  date: number;
  color?: string;
}

// Echarts doesn't expose this interface correctly
// eslint-disable-next-line
export class TrendCursorModel extends echarts.ComponentModel<TrendCursorOption> {
  static type = 'trendCursors' as const;
  type = TrendCursorModel.type;

  static dependencies = ['series', 'xAxis', 'yAxis', 'grid', 'polar'];

  date: number | null = null;
  color?: string = undefined;
  group?: string = undefined;

  init(option: TrendCursorOption) {
    this.optionUpdated(option);
  }

  optionUpdated(option: TrendCursorOption) {
    if (!option || !option.date || !option.group) return;
    this.id = `${option.id}`;
    this.group = option.group;
    this.date = option.date;
    this.color = option.color;
  }
}

export const createTestModel = (option: TrendCursorOption) =>
  ({
    id: `${option.id}`,
    group: option.group,
    date: option.date,
    color: option.color,
  } as TrendCursorModel);
