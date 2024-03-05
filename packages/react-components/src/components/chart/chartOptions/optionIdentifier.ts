import { DataStream } from "@iot-app-kit/core";

export const seriesId = (datastream: Pick<DataStream, 'id'>) => `datastream-${datastream.id}`;
export const customYAxisId = (datastream: Pick<DataStream, 'id'>) => `custom-y-axis-${datastream.id}`;
export const datasetId = (datastream: Pick<DataStream, 'id'>) => `dataset-${datastream.id}`;
