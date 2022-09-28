import {
  EntityPropertyReference,
  GetPropertyValueHistoryCommand,
  GetPropertyValueHistoryRequest,
  GetPropertyValueHistoryResponse,
  IoTTwinMakerClient,
  PropertyValueHistory,
} from '@aws-sdk/client-iottwinmaker';
import { isUndefined } from 'lodash';
import { Primitive } from '../../common/types';

export const getSinglePropertyValueHistory = async (
  getPropertyValueHistoryRequest: GetPropertyValueHistoryRequest,
  twinMakerClient: IoTTwinMakerClient
) => {
  const propertyValueHistoryOutput: { [id: string]: { x: number; y: Primitive }[] } = {};

  if (
    getPropertyValueHistoryRequest.entityId &&
    getPropertyValueHistoryRequest.componentName &&
    getPropertyValueHistoryRequest.selectedProperties
  ) {
    const propertyIndentifier = createPropertyIndentifierKey(
      getPropertyValueHistoryRequest.entityId,
      getPropertyValueHistoryRequest.componentName,
      getPropertyValueHistoryRequest.selectedProperties[0]
    );
    propertyValueHistoryOutput[propertyIndentifier] = [];

    const valuesResult = await getPropertyValueHistory(getPropertyValueHistoryRequest, twinMakerClient);

    valuesResult.forEach((propertyValueHistory) => {
      propertyValueHistory.values?.forEach((propertyValue) => {
        if (propertyValue.value) {
          let value: Primitive | undefined = undefined;
          if (propertyValue.value.stringValue !== undefined) {
            value = propertyValue.value.stringValue;
          } else if (propertyValue.value.doubleValue !== undefined) {
            value = propertyValue.value.doubleValue;
          } else if (propertyValue.value.integerValue !== undefined) {
            value = propertyValue.value.integerValue;
          } else if (propertyValue.value.longValue !== undefined) {
            value = propertyValue.value.longValue;
          } else if (propertyValue.value.booleanValue !== undefined) {
            value = propertyValue.value.booleanValue;
          }
          if (!isUndefined(value) && propertyValue.time) {
            propertyValueHistoryOutput[propertyIndentifier].push({
              x: new Date(propertyValue.time).getTime(),
              y: value,
            });
          }
        }
      });
    });
  }

  return propertyValueHistoryOutput;
};

const getPropertyValueHistory = async (
  getPropertyValueHistoryRequest: GetPropertyValueHistoryRequest,
  twinMakerClient: IoTTwinMakerClient
): Promise<PropertyValueHistory[]> => {
  let valuesResult: Map<string, PropertyValueHistory> = new Map();

  do {
    const response = await twinMakerClient.send(new GetPropertyValueHistoryCommand(getPropertyValueHistoryRequest));
    valuesResult = mergePropertyValueHistoryResponse(valuesResult, response);

    getPropertyValueHistoryRequest.nextToken = response.nextToken;
  } while (getPropertyValueHistoryRequest.nextToken);

  return Array.from(valuesResult.values());
};

const mergePropertyValueHistoryResponse = (
  currentHistories: Map<string, PropertyValueHistory>,
  newResponse: GetPropertyValueHistoryResponse
): Map<string, PropertyValueHistory> => {
  if (newResponse && newResponse.propertyValues) {
    newResponse.propertyValues.forEach((propertyValue) => {
      if (propertyValue.values && propertyValue.entityPropertyReference) {
        const entityRefKey = generateEntityRefKey(propertyValue.entityPropertyReference);
        const existingValues = currentHistories.get(entityRefKey);
        if (!existingValues) {
          currentHistories.set(entityRefKey, propertyValue);
        } else {
          existingValues.values?.push(...propertyValue.values);
        }
      }
    });
  }
  return currentHistories;
};

export const generateEntityRefKey = (entityRef: EntityPropertyReference): string => {
  let result = '';
  const externalIdProperties = Object.keys(entityRef.externalIdProperty || {}).sort();
  externalIdProperties.forEach((idPropertyName) => {
    result += idPropertyName + '=' + entityRef.externalIdProperty?.[idPropertyName] + '/';
  });

  if (entityRef.entityId) {
    result += entityRef.entityId + '/';
  }
  if (entityRef.componentName) {
    result += entityRef.componentName + '/';
  }
  result += entityRef.propertyName + '/';

  return result;
};

export const createPropertyIndentifierKey = (entityId: string, componentName: string, propertyName: string): string => {
  return `${entityId}_${componentName}_${propertyName}`;
};
