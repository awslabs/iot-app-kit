import type {
  TimeSeriesDataRequest,
  Viewport,
} from '../data-module/data-cache/requestTypes';
import type {
  ComparisonOperator,
  DataStreamId,
  StatusIconType,
  TimeSeriesData,
} from '../data-module/types';

export type ErrorDetails<T = undefined> = T extends undefined
  ? {
      msg: string;
      type?: string;
      status?: string;
    }
  : {
      msg: string;
      type?: string;
      status?: string;
      meta: T;
    };

export interface ProviderObserver<DataType> {
  next: (data: DataType) => void;
  error?: (error: any) => void;
}

export interface Provider<Result> {
  subscribe(observer: ProviderObserver<Result>): void;

  unsubscribe(): void;
}

export interface ProviderWithViewport<Result> extends Provider<Result> {
  updateViewport(viewport: Viewport): void;
}

export interface Query<Result, Params = void> {
  /** Builds the query into a provider */
  build(sessionId: string, params?: Params): Provider<Result>;

  /** Returns a string which is unique to the query */
  toQueryString(): string;
}

export interface TimeQuery<Result, Params = void>
  extends Query<Result, Params> {
  build(sessionId: string, params?: Params): ProviderWithViewport<Result>;
}

export type TimeSeriesDataQuery = TimeQuery<
  TimeSeriesData[],
  TimeSeriesDataRequest
>;

interface AnnotationLabel {
  text: string;
  show: boolean;
}

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

  // set to identify annotations
  // for example, this id can be used by an application to identify and update annotations when a widgetConfigurationUpdate is emitted from SynchroCharts
  id: string;
}

export interface Threshold<T extends ThresholdValue = ThresholdValue>
  extends Annotation<T> {
  comparisonOperator: ComparisonOperator;
  severity?: number;
  dataStreamIds?: DataStreamId[];
}

export interface ThresholdStyleType {
  visible?: boolean;
  fill?: string;
}

export type StyledThreshold = Threshold & ThresholdStyleType;

export interface ThresholdSettings {
  // Specify whether data that is breached by the thresholds will be colored based on the threshold configuration
  colorBreachedData?: boolean;
}

export interface DataModuleSession {
  close: VoidFunction;
}

export interface Session {
  close: VoidFunction;
}
