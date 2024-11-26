import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import type { DataSource, RequestInformationAndRange } from '@iot-app-kit/core';
import isEmpty from 'lodash-es/isEmpty';
import {
  type TwinMakerComponentHistoryQuery,
  type TwinMakerEntityHistoryQuery,
} from '../common/queryTypes';
import { type TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { isDefined } from '../utils/propertyValueUtils';
import { getPropertyValueHistoryByComponentType } from './client/getPropertyValueHistoryByComponentType';
import { getPropertyValueHistoryByEntity } from './client/getPropertyValueHistoryByEntity';
import type { TwinMakerDataStreamQuery } from './types';
import { toDataStreamId } from './utils/dataStreamId';

export const createDataSource = (
  metadataModule: TwinMakerMetadataModule,
  twinMaker: IoTTwinMakerClient
): DataSource<TwinMakerDataStreamQuery> => {
  return {
    initiateRequest: ({ onSuccess, onError }, requestInformations) => {
      const componenetTypeRequests: RequestInformationAndRange[] = [];
      const entityRequests: RequestInformationAndRange[] = [];
      requestInformations.forEach((req) => {
        if (!isEmpty(req.meta?.['componentTypeId'])) {
          componenetTypeRequests.push(req);
        } else {
          entityRequests.push(req);
        }
      });

      getPropertyValueHistoryByEntity({
        onSuccess,
        onError,
        client: twinMaker,
        requestInformations: entityRequests,
      });
      getPropertyValueHistoryByComponentType({
        metadataModule,
        onSuccess,
        onError,
        client: twinMaker,
        requestInformations: componenetTypeRequests,
      });
    },
    getRequestsFromQuery: async ({ query }) => {
      const entityQuery = query as TwinMakerEntityHistoryQuery;
      if (entityQuery.entityId && entityQuery.componentName) {
        return entityQuery.properties.flatMap(({ propertyName, refId }) => ({
          id: toDataStreamId({
            workspaceId: query.workspaceId,
            entityId: entityQuery.entityId,
            componentName: entityQuery.componentName,
            propertyName,
          }),
          refId,
          resolution: '0', // No resolution support
        }));
      }

      const componentQuery = query as TwinMakerComponentHistoryQuery;
      if (componentQuery.componentTypeId) {
        const entities = await metadataModule.fetchEntitiesByComponentTypeId({
          componentTypeId: componentQuery.componentTypeId,
        });

        const requests = entities.flatMap((entity) => {
          const requestComp = Object.values(entity.components || {}).find(
            (comp) => comp.componentTypeId === componentQuery.componentTypeId
          );
          const entityId = entity.entityId;
          const componentName = requestComp?.componentName;
          if (componentName && entityId !== undefined) {
            return componentQuery.properties.flatMap(
              ({ propertyName, refId }) => ({
                id: toDataStreamId({
                  workspaceId: query.workspaceId,
                  entityId: entityId,
                  componentName: componentName,
                  propertyName,
                }),
                refId,
                resolution: '0', // No resolution support
                meta: { componentTypeId: componentQuery.componentTypeId },
              })
            );
          }
        });
        return requests.filter(isDefined);
      }

      return [];
    },
  };
};
