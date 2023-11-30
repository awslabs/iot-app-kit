import { DataStream, Primitive, Threshold, ThresholdSettings, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { OptionId } from 'echarts/types/src/util/types';
import { InternalGraphicComponentGroupOption } from './trendCursor/types';

export type YAxisOptions = {
  yAxisLabel?: string;
  yMin?: number;
  yMax?: number;
};

export type ChartAxisOptions = YAxisOptions & {
  showY?: boolean;
  showX?: boolean;
};

export type ChartLegend = {
  backgroundColor?: string;
  position?: 'top' | 'bottom';
};

export type SimpleFontSettings = {
  fontSize?: number;
  fontColor?: string;
};

export type SizeConfig = { width: number; height: number };

export type Visualization = 'line' | 'bar' | 'scatter' | 'step-start' | 'step-middle' | 'step-end';

export type ChartStyleSettingsOptions = {
  /**
   * applies to all chart types
   *
   * chartType will enable comingled charts
   */
  visualizationType?: Visualization;
  color?: string;
  // show?: boolean; // show or hide data streams
  // highlighted?: boolean; // highlight specfic stream

  /**
   * applies to line and scatter chart types
   *
   * symbols supported in echarts with no additional work
   * 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
   * can also be images / svgs
   */
  symbol?: string; // 'emptyCircle' | 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
  symbolColor?: string;
  symbolSize?: number;

  /**
   * applies to line chart type
   */
  lineStyle?: 'solid' | 'dotted' | 'dashed';
  lineThickness?: number;

  yAxis?: YAxisOptions; // allows us to do multiple y axis

  significantDigits?: number; // allows us to customize decimals at a property level
};

export type ChartStyleSettings = {
  [refId: string]: ChartStyleSettingsOptions;
};

export type ChartEventType = { target: { id?: OptionId }; offsetX?: number };

export type ThresholdStyleType = {
  visible?: boolean;
  fill?: string;
};

export type StyledThreshold = Threshold & ThresholdStyleType;

export type ChartOptions = {
  queries: TimeSeriesDataQuery[];
  defaultVisualizationType?: Visualization;
  size?: SizeConfig;
  styleSettings?: ChartStyleSettings;
  thresholdSettings?: ThresholdSettings;
  aggregationType?: string;
  axis?: ChartAxisOptions;
  thresholds?: StyledThreshold[];
  viewport?: Viewport;
  gestures?: boolean;
  backgroundColor?: string;
  fontSettings?: SimpleFontSettings;
  legend?: ChartLegend;
  significantDigits?: number;
  graphic?: InternalGraphicComponentGroupOption[];
  theme?: string;
  id?: string;
  titleText?: string;
};

export interface ViewportInMs {
  end: number;
  initial: number;
  widthInMs: number;
  isDurationViewport: boolean;
}

export type YAxisLegendOption = {
  datastream?: DataStream;
  value?: Primitive;
  color?: string;
  significantDigits?: number;
};
