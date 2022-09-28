/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetEntityResponse, GetPropertyValueHistoryCommand, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { OnSuccessCallback, RequestInformationAndRange, ErrorCallback, DataStream } from '@iot-app-kit/core';
import { DataPoint } from '@synchro-charts/core';
import { isEmpty, isEqual } from 'lodash';
import { TwinMakerMetadataModule } from '../../metadata-module/TwinMakerMetadataModule';
import { fromDataStreamId, toDataStreamId } from '../utils/dataStreamId';
import { toDataPoint, isDefined, toDataStream, toDataType } from '../utils/values';

export const getPropertyValueHistoryByComponentTypeRequest = async ({
  workspaceId,
  componentTypeId,
  propertyNames,
  requestInformations,
  entities,
  onSuccess,
  onError,
  nextToken: prevToken,
  client,
  receivedStreamIds,
}: {
  workspaceId: string;
  componentTypeId: string;
  propertyNames: string[];
  requestInformations: Record<string, RequestInformationAndRange>;
  entities: GetEntityResponse[];
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  client: IoTTwinMakerClient;
  nextToken?: string;
  // Used to track stream ids that have already sent value back
  receivedStreamIds: string[];
}) => {
  try {
    const requestInformationSample = Object.values(requestInformations)[0];
    let { start, end } = requestInformationSample;
    // fetch leading point without mutating requestInformation
    if (requestInformationSample.fetchMostRecentBeforeStart) {
      end = start;
      start = new Date(start.getTime());
      start.setDate(start.getDate() - 1);
    } else if (requestInformationSample.fetchMostRecentBeforeEnd) {
      start = new Date(start.getTime());
      start.setDate(start.getDate() - 1);
    }

    // May let single data point query be handled by entity query
    const fetchMostRecent =
      requestInformationSample.fetchMostRecentBeforeStart || requestInformationSample.fetchMostRecentBeforeEnd;

    const response = await client.send(
      new GetPropertyValueHistoryCommand({
        workspaceId,
        componentTypeId,
        selectedProperties: propertyNames,
        orderByTime: fetchMostRecent ? 'DESCENDING' : 'ASCENDING',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        nextToken: prevToken,
      })
    );
    if (response) {
      const { propertyValues, nextToken } = response;

      propertyValues?.forEach((values) => {
        if (isEmpty(values.entityPropertyReference)) return;

        let matchingComponentName = '';
        const matchingEntity = entities.find(({ components }) => {
          let isMatch = false;
          Object.values(components || {}).forEach((comp) => {
            if (
              comp.componentTypeId === componentTypeId &&
              values.entityPropertyReference?.propertyName &&
              propertyNames.includes(values.entityPropertyReference?.propertyName) &&
              values.entityPropertyReference.externalIdProperty &&
              comp.componentName
            ) {
              // Find externalId key and value to be matched with entityPropertyReference.externalIdProperty
              const externalIdPropertyKey = Object.keys(comp.properties || {}).find(
                (key) => comp.properties?.[key].definition?.isExternalId
              );
              if (!externalIdPropertyKey) return;

              const externalIdPropertyValue = Object.values(comp.properties?.[externalIdPropertyKey].value || {}).find(
                isDefined
              );
              if (!externalIdPropertyValue) return;

              if (
                values.entityPropertyReference.externalIdProperty[externalIdPropertyKey] === externalIdPropertyValue
              ) {
                isMatch = true;
                matchingComponentName = comp.componentName;
              }
            }
          });

          return isMatch;
        });
        const entityId = matchingEntity?.entityId;
        const propertyName = values.entityPropertyReference.propertyName;

        if (!entityId || isEmpty(matchingComponentName) || !propertyName) return;

        const streamId = toDataStreamId({
          workspaceId,
          entityId: entityId,
          componentName: matchingComponentName,
          propertyName,
        });

        const matchingRequestInfo = requestInformations[streamId];

        if (!matchingRequestInfo) return;

        /** Report the page of data to the data-module */
        const dataPoints: DataPoint[] = values.values
          ? values.values.map((propertyValue) => toDataPoint(propertyValue)).filter(isDefined)
          : [];
        const mostRecentDataPoints: DataPoint[] = dataPoints.length > 0 ? [dataPoints[0]] : [];
        const dataType =
          matchingEntity?.components?.[matchingComponentName].properties?.[propertyName].definition?.dataType;

        const stream: DataStream = {
          ...toDataStream({
            streamId,
            dataPoints: fetchMostRecent ? mostRecentDataPoints : dataPoints,
            entityId,
            componentName: matchingComponentName,
            propertyName,
          }),
          name: propertyName,
          unit: dataType?.unitOfMeasure,
          dataType: dataType ? toDataType(dataType) : undefined,
        };

        // When fetching most recent, only need the data from the first stream generated for the id
        if (fetchMostRecent) {
          if (!receivedStreamIds.includes(streamId)) {
            onSuccess([stream], matchingRequestInfo, start, end);
          }
        } else {
          onSuccess([stream], matchingRequestInfo, start, end);
        }
        receivedStreamIds.push(streamId);
      });

      if (nextToken) {
        getPropertyValueHistoryByComponentTypeRequest({
          workspaceId,
          componentTypeId,
          propertyNames,
          requestInformations,
          entities,
          onError,
          onSuccess,
          nextToken,
          client,
          receivedStreamIds,
        });
      }
    }
  } catch (err: any) {
    const streamIds = Object.keys(requestInformations);

    streamIds.forEach((id) => {
      if (!receivedStreamIds.includes(id)) {
        onError({
          id,
          resolution: 0,
          error: { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode },
        });
      }
    });
  }
};

export const getPropertyValueHistoryByComponentType = async ({
  metadataModule,
  onSuccess,
  onError,
  client,
  requestInformations,
}: {
  metadataModule: TwinMakerMetadataModule;
  onSuccess: OnSuccessCallback;
  onError: ErrorCallback;
  client: IoTTwinMakerClient;
  requestInformations: RequestInformationAndRange[];
}): Promise<void> => {
  // Group same component type API call into one
  const requestInputs: {
    params: { componentTypeId: string; workspaceId: string };
    propertyNames: string[];
    requestInfos: Record<string, RequestInformationAndRange>;
    entities: GetEntityResponse[];
  }[] = [];

  requestInformations.forEach(async (info) => {
    const { workspaceId, propertyName } = fromDataStreamId(info.id);
    const componentTypeId =
      info.meta?.['componentTypeId'] !== undefined ? String(info.meta?.['componentTypeId']) : undefined;
    if (!componentTypeId || isEmpty(componentTypeId)) {
      return;
    }

    // Find the group of the requests for the same API call
    const inputIndex = requestInputs.findIndex((input) => {
      const requestInfo = Object.values(input.requestInfos)[0];
      // Compare all fields except id since it has entity info and is different for different request
      const inputInfo = {
        ...requestInfo,
        id: undefined,
        start: requestInfo.start.getTime(),
        end: requestInfo.end.getTime(),
      };
      const compareInfo = { ...info, id: undefined, start: info.start.getTime(), end: info.end.getTime() };

      return isEqual(inputInfo, compareInfo);
    });

    if (inputIndex >= 0) {
      requestInputs[inputIndex].requestInfos[info.id] = info;
      if (!requestInputs[inputIndex].propertyNames.includes(propertyName)) {
        requestInputs[inputIndex].propertyNames.push(propertyName);
      }
    } else {
      requestInputs.push({
        params: {
          componentTypeId: componentTypeId,
          workspaceId: workspaceId,
        },
        propertyNames: [propertyName],
        requestInfos: { [info.id]: info },
        entities: [],
      });
    }
  });

  const requests = requestInputs.map(async (input) => {
    const entities = await metadataModule.fetchEntitiesByComponentTypeId({
      componentTypeId: input.params.componentTypeId,
    });

    return getPropertyValueHistoryByComponentTypeRequest({
      workspaceId: input.params.workspaceId,
      componentTypeId: input.params.componentTypeId,
      propertyNames: input.propertyNames,
      requestInformations: input.requestInfos,
      entities,
      onSuccess,
      onError,
      client,
      receivedStreamIds: [],
    });
  });

  try {
    await Promise.all([requests]);
  } catch (err) {
    // NOOP
  }
};
