import { ScaleContinuousNumeric, ScaleTime } from 'd3-scale';
import { Selection } from 'd3-selection';

import {
  BaseConfig,
  DataPoint,
  DataStream,
  DataStreamId,
  MessageOverrides,
  MinimalViewPortConfig,
  SizeConfig,
  ViewPortConfig,
} from '../../../utils/dataTypes';
import { COMPARISON_OPERATOR, LEGEND_POSITION, ScaleType, StatusIcon } from '../../common/constants';

export type Scale = ScaleContinuousNumeric<number, number> | ScaleTime<any, any>;

export type SVGSelection = Selection<SVGGElement, unknown, null, undefined>;

export type AnySelection = Selection<any, any, any, any>;

export interface ScaleConfig {
  xScaleType: ScaleType;
  yScaleType: ScaleType;
  xScaleSide: 'top' | 'bottom';
  yScaleSide: 'left' | 'right';
}

export interface LayoutConfig {
  xTicksVisible: boolean;
  yTicksVisible: boolean;
  xGridVisible: boolean;
  yGridVisible: boolean;
}

export interface LegendConfig {
  position: LEGEND_POSITION;
  width: number;
  // Whether the colored bars appear in the legend or not.
  showDataStreamColor?: boolean;
  legendLabels?: {
    title: string;
  };
}

/**
 * Chart Config needed to be passed in by external users of the chart components
 *
 * Missing fields will be substituted with defaults
 */
export interface ChartConfig extends BaseConfig {
  viewport: MinimalViewPortConfig;
  movement?: MovementConfig;
  scale?: ScaleConfig;
  layout?: LayoutConfig;
  legend?: LegendConfig;
  annotations?: Annotations;
  axis?: Axis.Options;
  messageOverrides?: MessageOverrides;
}

export type WidgetConfigurationUpdate = Omit<ChartConfig, 'viewport' | 'messageOverrides'> & {
  dataStreams: Omit<DataStream, 'data' | 'aggregates'>[];
  widgetId: string;
};

/**
 * Internal Chart Config Used within the chart components
 */
export interface BaseChartConfig extends ChartConfig {
  dataStreams: DataStream[];
  viewport: ViewPortConfig;
  movement: MovementConfig;
  layout: LayoutConfig;
  scale: ScaleConfig;
  size: SizeConfig;
}

export interface MovementConfig {
  // Controls whether panning is enabled on each axis
  enableXScroll: boolean;
  enableYScroll: boolean;
  // Control the scaling factor limits to zoom.
  zoomMax: number; // defaults to 1
  zoomMin: number; // defaults to 1
}

/**
 * View model for a data point within the tooltip and legend
 */
export type FocusPoint = {
  id: string;
  pos: { x: number; y: number };
  datum: DataPoint;
  value: number;
  color: string;
  isInterpolated: boolean;
};

type AnnotationLabel = {
  text: string;
  show: boolean;
};

export type AnnotationValue = number | string | boolean | Date;
export type ThresholdValue = number | string | boolean;

export interface Annotation<T extends AnnotationValue> {
  color: string;
  value: T;
  showValue?: boolean;
  label?: AnnotationLabel;
  icon?: StatusIcon;
  // Description of the annotation, i.e. temperature < 30
  // Utilized to provide context where annotation/thresholds are utilized/breached
  description?: string;

  // configures whether the annotation is editable
  // false or undefined = annotation is not draggable
  isEditable?: boolean;

  // optional id that can be set to identify annotations
  // for example, this id can be used by an application to identify and update annotations when a widgetConfigurationUpdate is emitted from SynchroCharts
  id?: string;
}

/**
 * Annotation becomes a threshold when a comparison operator is added.
 *
 * The comparison operator determines how the data-value is evaluated against the threshold-value
 */
export interface Threshold<T extends ThresholdValue = ThresholdValue> extends Annotation<T> {
  comparisonOperator: COMPARISON_OPERATOR;
  // higher severity implies more important threshold. used in evaluating which 'breached' threshold is the most important one to communicate to a user
  // Thresholds with no severity are considered the least severe
  severity?: number;
  // If present, threshold is considered to only only the specified streams. otherwise the threshold
  // applies to all data streams within a widget which contains the given threshold.
  dataStreamIds?: DataStreamId[];
}

export type XAnnotation = Annotation<Date>;

export type YAnnotation = Annotation<number | string | boolean> | Threshold;

export interface Annotations {
  show?: boolean;
  x?: XAnnotation[];
  y?: YAnnotation[];
  thresholdOptions?: ThresholdOptions | boolean;
  colorDataAcrossThresholds?: boolean;
}

export interface ThresholdBand {
  upper: number;
  lower: number;
  // r, g, b
  color: [number, number, number];
}

export interface ThresholdOptions {
  showColor?: boolean;
}

export namespace Axis {
  export interface Options {
    showY?: boolean;
    showX?: boolean;
    labels?: AxisLabels;
  }

  export interface AxisLabels {
    yAxis?: LabelConfig;
  }

  export interface LabelConfig {
    content: string;
    // color?: string; todo
    // size?: string; todo
  }
}

export interface ThresholdColorAndIcon {
  color: string | undefined;
  icon: StatusIcon | undefined;
}
