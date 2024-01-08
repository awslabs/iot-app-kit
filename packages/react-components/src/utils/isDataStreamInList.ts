import { DataStream } from '@iot-app-kit/core';

export const isDataStreamInList =
  (datastreams: DataStream[]) => (datastream?: DataStream) =>
    !!datastream && !!datastreams.find(({ id }) => id === datastream.id);
