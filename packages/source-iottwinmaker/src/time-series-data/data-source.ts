import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { toDataStreamId } from './utils/dataStreamId';
import { DataSource } from '@iot-app-kit/core';
import { TwinMakerDataStreamQuery } from './types';
import { getPropertyValueHistoryByEntity } from './client/getPropertyValueHistoryByEntity';
import { isEmpty } from 'lodash';

export const TWINMAKER_DATA_SOURCE = 'twin-maker';

export const createDataSource = (twinMaker: IoTTwinMakerClient): DataSource<TwinMakerDataStreamQuery> => {
  return {
    name: TWINMAKER_DATA_SOURCE,
    initiateRequest: ({ onSuccess, onError }, requestInformations) =>
      // TODO: the data source only supports query by entityId and componentName, not by componentType for now.
      getPropertyValueHistoryByEntity({ onSuccess, onError, client: twinMaker, requestInformations }),
    getRequestsFromQuery: ({ query }) => {
      // TODO: the data source only supports query by entityId and componentName, not by componentType for now.
      const entityQuery = query;
      if (isEmpty(entityQuery.entityId) || isEmpty(entityQuery.componentName)) {
        return [];
      }

      return query.properties.flatMap(({ propertyName, refId }) => ({
        id: toDataStreamId({
          workspaceId: query.workspaceId,
          entityId: entityQuery.entityId,
          componentName: entityQuery.componentName,
          propertyName,
        }),
        refId,
        resolution: '0', // No resolution support
      }));
    },
  };
};
