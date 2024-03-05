import { LineSeriesOption, SeriesOption } from 'echarts';

type SignificantDigitsMixin = { appKitSignificantDigits?: number };
type ColorMixin = { appKitColor?: string };

export type GenericSeries = LineSeriesOption & SignificantDigitsMixin & ColorMixin;
