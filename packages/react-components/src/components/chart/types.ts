import {
  DataStream,
  Primitive,
  StyledThreshold,
  ThresholdSettings,
  Viewport,
} from '@iot-app-kit/core';
import { OptionId } from 'echarts/types/src/util/types';
import { AssistantProperty } from '../../common/assistantProps';
import type { ComponentQuery } from '../../common/chartTypes';

export type YAxisOptions = {
  yLabel?: string;
  yMin?: number;
  yMax?: number;
};

export type ChartAxisOptions = YAxisOptions & {
  showY?: boolean;
  showX?: boolean;
};

type ChartLegendContent =
  | 'unit'
  | 'asset'
  | 'visibility'
  | 'maxValue'
  | 'minValue'
  | 'latestValue'
  | 'latestAlarmStateValue';
export type ChartLegend = {
  visible?: boolean;
  position?: 'left' | 'bottom' | 'right';
  height?: string;
  width?: string;
  visibleContent?: { [key in ChartLegendContent]?: boolean };
};

export type SimpleFontSettings = {
  fontSize?: number;
  fontColor?: string;
};

export type SizeConfig = { width: number; height: number };

export type Visualization =
  | 'line'
  | 'bar'
  | 'scatter'
  | 'step-start'
  | 'step-middle'
  | 'step-end';

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
  name?: string; // Used to custom label the datastream name
};

export type ChartStyleSettings = {
  [refId: string]: ChartStyleSettingsOptions;
};

export type ChartEventType = { target: { id?: OptionId }; offsetX?: number };

export type ChartDataQuality = {
  showBadDataIcons?: boolean;
  showUncertainDataIcons?: boolean;
};

export type ChartAlarms = {
  showAlarmIcons?: boolean;
}

export type ChartOptions = {
  queries: ComponentQuery[];
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
  theme?: string;
  id?: string;
  dataQuality?: ChartDataQuality;
  assistant?: AssistantProperty;
  onChartOptionsChange?: (
    options: Pick<ChartOptions, 'legend' | 'dataQuality'>
  ) => void;
  titleText?: string;
  timeZone?: string;
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
