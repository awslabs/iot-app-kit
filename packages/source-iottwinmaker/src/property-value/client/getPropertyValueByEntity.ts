import {
  GetPropertyValueCommand,
  type GetPropertyValueResponse,
  type IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';
import { type DataStreamBase, type DataType } from '@iot-app-kit/core';
import isNumber from 'lodash-es/isNumber';
import { toValue } from '../../utils/propertyValueUtils';
import { type TwinMakerStaticDataQuery } from '../types';

/**
 * Call TwinMaker GetPropertyValue API to get property value
 * @param query defines the entityId, componentName and propertyNames to call API
 * @returns a list of propertyValues for each property separately
 */
export const getPropertyValueByEntity = async ({
  client,
  query,
}: {
  client: IoTTwinMakerClient;
  query: TwinMakerStaticDataQuery;
}): Promise<DataStreamBase[]> => {
  const results: DataStreamBase[] = [];
  let nextToken: string | undefined = undefined;
  do {
    const response: GetPropertyValueResponse = await client.send(
      new GetPropertyValueCommand({
        workspaceId: query.workspaceId,
        entityId: query.entityId,
        componentName: query.componentName,
        selectedProperties: query.properties.map(
          (property) => property.propertyName
        ),
        nextToken,
      })
    );

    if (response.propertyValues) {
      Object.keys(response.propertyValues).forEach((key) => {
        const value = response.propertyValues?.[key].propertyValue;
        if (!value) {
          return;
        }
        const meta = {
          entityId: query.entityId,
          componentName: query.componentName,
          propertyName: key,
        };

        const data = toValue(value);
        if (!data) {
          return;
        }

        // TODO: handle non-primitive types when needed
        let dataType: DataType = 'STRING';
        if (value.booleanValue !== undefined) {
          dataType = 'BOOLEAN';
        } else if (isNumber(data)) {
          dataType = 'NUMBER';
        }

        results.push({ dataType, data: [{ y: data }], meta });
      });
    }

    nextToken = response.nextToken;
  } while (nextToken);

  return results;
};
