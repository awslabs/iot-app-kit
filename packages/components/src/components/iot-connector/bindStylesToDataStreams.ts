import { StyleSettingsMap, DataStream } from '@iot-app-kit/core';

// If the data stream has a reference id with associated styles, append those styles to the data stream.
export const bindStylesToDataStreams = ({
  dataStreams,
  styleSettings,
}: {
  dataStreams: DataStream[];
  styleSettings?: StyleSettingsMap;
}): DataStream[] =>
  dataStreams.map((dataStream) =>
    styleSettings == null || dataStream.refId == null
      ? dataStream
      : {
          ...dataStream,
          ...styleSettings[dataStream.refId],
        }
  );
