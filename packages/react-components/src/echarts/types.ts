import { SeriesOption } from 'echarts';

type SignificantDigitsMixin = { appKitSignificantDigits?: number };
type ColorMixin = { appKitColor?: string };

export type GenericSeries = SeriesOption & SignificantDigitsMixin & ColorMixin;
