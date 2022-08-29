import { DataStream, DataType } from '@iot-app-kit/core';
import { GetEntityResponse, DataType as TMDataType, Type } from '@aws-sdk/client-iottwinmaker';
import { fromDataStreamId } from './utils/dataStreamId';

/**
 * Convert the TwinMaker DataType into AppKit DataType
 *
 * @param tmDataType the TwinMaker DataType to be converted.
 * @returns the converted AppKit DataType
 */
export const toDataType = (tmDataType: TMDataType): DataType | undefined => {
  if (!tmDataType.type) return undefined;

  switch (tmDataType.type) {
    case Type.BOOLEAN:
      return 'BOOLEAN';
    case Type.DOUBLE:
    case Type.INTEGER:
    case Type.LONG:
      return 'NUMBER';
    default:
      // Other types are converted to string for now.
      return 'STRING';
  }
};

/**
 * Get completed data streams by merging together the data streams with the entities.
 *
 * @param param0 the dataStreams with data points, and the entities with additional information about the stream
 * @returns completed data streams will all information combined
 */
export const completeDataStreams = ({
  dataStreams,
  entities,
}: {
  dataStreams: DataStream[];
  entities: Record<string, GetEntityResponse>;
}): DataStream[] =>
  dataStreams.map((dataStream) => {
    const { entityId, componentName, propertyName } = fromDataStreamId(dataStream.id);
    const entity = entities[entityId];
    const dataType = entity?.components?.[componentName].properties?.[propertyName].definition?.dataType;

    if (!dataType) {
      return dataStream;
    }

    return {
      ...dataStream,
      name: propertyName,
      unit: dataType.unitOfMeasure,
      dataType: toDataType(dataType),
    };
  });
