import { fromDataStreamId } from './utils/dataStreamId';
import type { DataStream } from '@iot-app-kit/core';
import type { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';
import { toDataType } from '../utils/propertyValueUtils';

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
    const { entityId, componentName, propertyName } = fromDataStreamId(
      dataStream.id
    );
    const entity = entities[entityId];
    const dataType =
      entity?.components?.[componentName]?.properties?.[propertyName]
        ?.definition?.dataType;

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
