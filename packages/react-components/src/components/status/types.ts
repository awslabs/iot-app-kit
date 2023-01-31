import { DataPoint, DataStream, MessageOverrides, MinimalViewPortConfig } from '../../utils/dataTypes';
import { LabelsConfig } from '../common/types';
import { Annotations, Threshold } from '../charts/common/types';
import { StatusIcon } from '../common/constants';

export type StatusCellProps = {
  messageOverrides: MessageOverrides;
  breachedThreshold?: Threshold;
  alarmStream?: DataStream;
  alarmPoint?: DataPoint;
  propertyStream?: DataStream;
  propertyPoint?: DataPoint;
  isEnabled: boolean;
  valueColor?: string; // css color string
  icon?: StatusIcon;
  labelsConfig: Required<LabelsConfig>;
  isEditing: boolean;
  onChangeLabel: ({ streamId, name }: { streamId: string; name: string }) => void;
}

export type StatusGridProps = {
  labelsConfig: LabelsConfig;
  viewport: MinimalViewPortConfig;
  widgetId: string;
  dataStreams: DataStream[];
  annotations: Annotations;
  isEditing: boolean;
  messageOverrides: MessageOverrides;
}
