import { DataStream } from '@iot-app-kit/core';

export const isDataStreamInList =
  (datastreams: Pick<DataStream, 'id'>[]) =>
  (datastream?: Pick<DataStream, 'id'>) =>
    !!datastream && !!datastreams.find(({ id }) => id === datastream.id);
