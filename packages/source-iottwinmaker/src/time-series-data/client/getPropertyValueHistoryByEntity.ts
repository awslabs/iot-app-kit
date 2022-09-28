import { GetPropertyValueHistoryCommand, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { OnSuccessCallback, RequestInformationAndRange, ErrorCallback } from '@iot-app-kit/core';
import { isEqual } from 'lodash';
import { fromDataStreamId, toDataStreamId } from '../utils/dataStreamId';
import { toDataPoint, isDefined, toDataStream } from '../utils/values';

export const getPropertyValueHistoryByEntityRequest = ({
  workspaceId,
  entityId,
  componentName,
  propertyNames,
  requestInformations,
  onSuccess,
  onError,
  nextToken: prevToken,
  client,
}: {
  workspaceId: string;
  entityId: string;
  componentName: string;
  propertyNames: string[];
  requestInformations: Record<string, RequestInformationAndRange>;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  client: IoTTwinMakerClient;
  nextToken?: string;
}) => {
  const requestInformationSample = Object.values(requestInformations)[0];
  let { start, end } = requestInformationSample;
  // fetch leading point without mutating requestInformation
  if (requestInformationSample.fetchMostRecentBeforeStart) {
    end = start;
    start = new Date(0, 0, 0);
  } else if (requestInformationSample.fetchMostRecentBeforeEnd) {
    start = new Date(0, 0, 0);
  }

  const fetchMostRecent =
    requestInformationSample.fetchMostRecentBeforeStart || requestInformationSample.fetchMostRecentBeforeEnd;

  return client
    .send(
      new GetPropertyValueHistoryCommand({
        workspaceId,
        entityId,
        componentName,
        selectedProperties: propertyNames,
        maxResults: fetchMostRecent ? 1 : undefined,
        orderByTime: fetchMostRecent ? 'DESCENDING' : 'ASCENDING',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        nextToken: prevToken,
      })
    )
    .then((response) => {
      if (response) {
        const { propertyValues, nextToken } = response;
        propertyValues?.forEach(({ entityPropertyReference, values }) => {
          if (
            entityPropertyReference?.entityId === entityId &&
            entityPropertyReference?.componentName === componentName &&
            entityPropertyReference?.propertyName &&
            propertyNames.includes(entityPropertyReference.propertyName) &&
            values
          ) {
            /** Report the page of data to the data-module */
            const dataPoints = values.map((propertyValue) => toDataPoint(propertyValue)).filter(isDefined);

            const streamId = toDataStreamId({
              workspaceId,
              entityId,
              componentName,
              propertyName: entityPropertyReference.propertyName,
            });
            onSuccess(
              [
                toDataStream({
                  streamId,
                  dataPoints,
                  entityId,
                  componentName,
                  propertyName: entityPropertyReference.propertyName,
                }),
              ],
              requestInformations[streamId],
              start,
              end
            );
          }
        });

        if (nextToken && !fetchMostRecent) {
          getPropertyValueHistoryByEntityRequest({
            workspaceId,
            entityId,
            componentName,
            propertyNames,
            requestInformations,
            onError,
            onSuccess,
            nextToken,
            client,
          });
        }
      }
    })
    .catch((err) => {
      Object.keys(requestInformations).forEach((id) => {
        onError({
          id,
          resolution: 0,
          error: { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode },
        });
      });
    });
};

export const getPropertyValueHistoryByEntity = async ({
  onSuccess,
  onError,
  client,
  requestInformations,
}: {
  onSuccess: OnSuccessCallback;
  onError: ErrorCallback;
  client: IoTTwinMakerClient;
  requestInformations: RequestInformationAndRange[];
}): Promise<void> => {
  const requestInputs: {
    params: { entityId: string; componentName: string; workspaceId: string };
    propertyNames: string[];
    requestInfos: Record<string, RequestInformationAndRange>;
  }[] = [];

  requestInformations.forEach(async (info) => {
    const { workspaceId, entityId, componentName, propertyName } = fromDataStreamId(info.id);
    // Don't combine different propertyNames into the same API call when fetching most recent is true
    // because setting maxResults = 1 doesn't work as wanted in this case to return 1 result per property.
    if (info.fetchMostRecentBeforeEnd || info.fetchMostRecentBeforeStart) {
      requestInputs.push({
        params: {
          workspaceId,
          entityId,
          componentName,
        },
        propertyNames: [propertyName],
        requestInfos: { [info.id]: info },
      });
      return;
    }

    // Find the group of the requests for the same API call
    const inputIndex = requestInputs.findIndex((input) => {
      const ids = fromDataStreamId(info.id);
      if (ids.workspaceId !== workspaceId || ids.entityId !== entityId || ids.componentName !== componentName)
        return false;

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
          workspaceId,
          entityId,
          componentName,
        },
        propertyNames: [propertyName],
        requestInfos: { [info.id]: info },
      });
    }
  });

  const requests = requestInputs.map(async (input) => {
    return getPropertyValueHistoryByEntityRequest({
      workspaceId: input.params.workspaceId,
      entityId: input.params.entityId,
      componentName: input.params.componentName,
      propertyNames: input.propertyNames,
      requestInformations: input.requestInfos,
      onSuccess,
      onError,
      client,
    });
  });

  try {
    await Promise.all(requests);
  } catch (err) {
    // NOOP
  }
};
