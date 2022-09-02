import { GetPropertyValueHistoryCommand, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { OnSuccessCallback, RequestInformationAndRange, ErrorCallback } from '@iot-app-kit/core';
import { fromDataStreamId, toDataStreamId } from '../utils/dataStreamId';
import { toDataPoint, isDefined, toDataStream } from '../utils/values';

export const getPropertyValueHistoryByEntityRequest = ({
  requestInformation,
  onSuccess,
  onError,
  nextToken: prevToken,
  client,
}: {
  requestInformation: RequestInformationAndRange;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  client: IoTTwinMakerClient;
  nextToken?: string;
}) => {
  let { start, end } = requestInformation;
  // fetch leading point without mutating requestInformation
  if (requestInformation.fetchMostRecentBeforeStart) {
    end = start;
    start = new Date(0, 0, 0);
  } else if (requestInformation.fetchMostRecentBeforeEnd) {
    start = new Date(0, 0, 0);
  }

  const { workspaceId, entityId, componentName, propertyName } = fromDataStreamId(requestInformation.id);
  const fetchMostRecent = requestInformation.fetchMostRecentBeforeStart || requestInformation.fetchMostRecentBeforeEnd;

  return client
    .send(
      new GetPropertyValueHistoryCommand({
        workspaceId,
        entityId,
        componentName,
        selectedProperties: [propertyName],
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
        const matchingPropertyValue = propertyValues?.find(
          ({ entityPropertyReference }) =>
            entityPropertyReference?.entityId === entityId &&
            entityPropertyReference?.componentName === componentName &&
            entityPropertyReference?.propertyName === propertyName
        );
        if (matchingPropertyValue?.values) {
          /** Report the page of data to the data-module */
          const dataPoints = matchingPropertyValue.values
            .map((propertyValue) => toDataPoint(propertyValue))
            .filter(isDefined);

          const streamId = toDataStreamId({ workspaceId, entityId, componentName, propertyName });
          onSuccess(
            [toDataStream({ streamId, dataPoints, entityId, componentName, propertyName })],
            requestInformation,
            start,
            end
          );
        }

        if (nextToken && !fetchMostRecent) {
          getPropertyValueHistoryByEntityRequest({
            requestInformation,
            onError,
            onSuccess,
            nextToken,
            client,
          });
        }
      }
    })
    .catch((err) => {
      const id = toDataStreamId({ workspaceId, entityId, componentName, propertyName });
      onError({
        id,
        resolution: 0,
        error: { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode },
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
  // TODO: May bundle the requests for the same entity & component, but different properties into the same call
  const requests = requestInformations.map((requestInformation) => {
    return getPropertyValueHistoryByEntityRequest({
      requestInformation,
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
