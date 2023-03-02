import { DataPoint, DataStreamId } from '@iot-app-kit/core';
import { ScaleContinuousNumeric, ScaleTime } from 'd3-scale';
import { Selection } from 'd3-selection';

import { COMPARISON_OPERATOR, ScaleType, StatusIconType } from './constants';

/* eslint-disable-next-line */
export type Scale = ScaleContinuousNumeric<number, number> | ScaleTime<any, any>;

export type SVGSelection = Selection<SVGGElement, unknown, null, undefined>;

/* eslint-disable-next-line */
export type AnySelection = Selection<any, any, any, any>;

export interface ScaleConfig {
  xScaleType: ScaleType;
  yScaleType: ScaleType;
  xScaleSide: 'top' | 'bottom';
  yScaleSide: 'left' | 'right';
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
  icon?: StatusIconType;
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

// eslint-disable-next-line @typescript-eslint/no-namespace
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
  }
}

export interface ThresholdColorAndIcon {
  color: string | undefined;
  icon: StatusIconType | undefined;
}
