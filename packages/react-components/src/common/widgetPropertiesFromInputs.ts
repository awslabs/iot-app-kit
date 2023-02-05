import { DataStream } from '@iot-app-kit/core';
import { StreamType } from './constants';
import { WidgetSettings } from './dataTypes';
import { Annotations } from '../common/thresholdTypes';

const DEFAULT_FONT_COLOR = 'black';

export const widgetPropertiesFromInputs = ({
  dataStreams,
  color,
}: {
  dataStreams: DataStream[];
  annotations?: Annotations;
  color?: string; // hex color string
}): WidgetSettings => {
  const propertyStream = dataStreams.find(({ streamType }) => streamType == null);
  const alarmStream = dataStreams.find(({ streamType }) => streamType == StreamType.ALARM);

  const stream = propertyStream || alarmStream;
  const valueColor = color || stream?.color || DEFAULT_FONT_COLOR;

  // TODO(btd): Take into account of breaching thresholds

  // TODO(btd): Need to take into account viewport and whether the alarm stream is associated to the given property stream.
  const alarmPoint = alarmStream?.data[alarmStream.data.length - 1];

  // TODO(btd): Need to take into account viewport
  const propertyPoint = propertyStream?.data[propertyStream.data.length - 1];

  return {
    icon: undefined, // TODO: Grab icon from breached threshold
    alarmPoint,
    propertyPoint,
    name: stream?.name,
    detailedName: stream?.detailedName,
    color: valueColor,
  };
};
