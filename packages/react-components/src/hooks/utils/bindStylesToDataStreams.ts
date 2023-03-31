import { assignDefaultColor as assignColor } from '@iot-app-kit/core-util';
import type { DataStream, StyleSettingsMap } from '@iot-app-kit/core';

const assignDefaultColor = ({
  dataStream,
  index,
  styleSettings,
}: {
  dataStream: DataStream;
  index: number;
  styleSettings?: StyleSettingsMap;
}): DataStream => {
  const associatedStyles = dataStream.refId != null && styleSettings != null ? styleSettings[dataStream.refId] : {};
  const hasAssociatedColor = 'color' in associatedStyles;

  // Only provide default if one is not already present in the data stream, and none is specified in the associated style settings.
  if (dataStream.color == null && !hasAssociatedColor) {
    return assignColor(dataStream, index);
  }
  return dataStream;
};

// If the data stream has a reference id with associated styles, append those styles to the data stream.
export const bindStylesToDataStreams = ({
  dataStreams,
  styleSettings,
  assignDefaultColors,
}: {
  dataStreams: DataStream[];
  assignDefaultColors: boolean;
  styleSettings?: StyleSettingsMap;
}): DataStream[] => {
  const streams = dataStreams.map((dataStream) =>
    styleSettings == null || dataStream.refId == null
      ? dataStream
      : {
          ...dataStream,
          ...styleSettings[dataStream.refId],
        }
  );

  return assignDefaultColors
    ? streams.map((dataStream, index) => assignDefaultColor({ dataStream, index, styleSettings }))
    : streams;
};
