import { Annotations, Threshold } from '../charts/common/types';
import { DataPoint, DataStream, MessageOverrides, MinimalViewPortConfig, TimeSeriesData } from '../../utils/dataTypes';
import { LabelsConfig } from '../common/types';
import { StatusIcon } from '../common/constants';
import { TimeQuery, TimeSeriesDataRequest, TimeSeriesDataRequestSettings } from '@iot-app-kit/core';

export type CellOptions = {
  error: string | undefined;
  labelsConfig?: LabelsConfig;
  icon?: StatusIcon;
  isEditing: boolean;
  isEnabled: boolean;
  isRefreshing?: boolean;
  isLoading?: boolean;
  messageOverrides: MessageOverrides;
  miniVersion: boolean;
  onChangeLabel?: ({ streamId, name }: { streamId: string; name: string }) => void;
  breachedThreshold?: Threshold;
  point?: DataPoint | undefined;
  alarmPoint?: DataPoint;
  alarmStream?: DataStream;
  propertyPoint?: DataPoint;
  propertyStream?: DataStream;
  trendStream: DataStream | undefined;
  valueColor?: string;
  viewport: MinimalViewPortConfig;
};

export type RenderCell = (cellOptions: CellOptions) => void;

export interface WidgetGridProps {
  renderCell: RenderCell;
  collapseVertically: boolean;
  labelsConfig?: LabelsConfig;
  viewport: MinimalViewPortConfig;
  widgetId: string;
  dataStreams: DataStream[];
  annotations: Annotations;
  isEditing: boolean;
  messageOverrides: MessageOverrides;
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  settings: TimeSeriesDataRequestSettings;
}