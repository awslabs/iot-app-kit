import { initialize } from '@iot-app-kit/source-iotsitewise';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { AlarmData } from '../hooks/useAlarms';
import { parseAlarmStateAssetProperty } from '../hooks/useAlarms/transformers';

// Transforms an AlarmData object into an object containing a timeSeriesDataQuery and alarm state
export const buildTransformAlarmForSingleQueryWidgets =
  ({
    iotSiteWiseClient,
    iotEventsClient,
  }: {
    iotSiteWiseClient?: IoTSiteWiseClient;
    iotEventsClient?: IoTEventsClient;
  }) =>
  (alarm: AlarmData) => {
    const { inputProperty, assetId, status, state } = alarm;

    const propertyId = inputProperty?.at(0)?.property.id;
    const latestState = state?.data?.at(-1);

    if (
      status.isSuccess &&
      assetId &&
      propertyId &&
      iotSiteWiseClient &&
      iotEventsClient
    ) {
      const timeSeriesDataQuery = initialize({
        iotSiteWiseClient,
        iotEventsClient,
      }).query.timeSeriesData({
        assets: [
          {
            assetId,
            properties: [
              {
                propertyId,
              },
            ],
          },
        ],
      });

      return {
        state: parseAlarmStateAssetProperty(latestState)?.value.state,
        timeSeriesDataQueries: [timeSeriesDataQuery],
      };
    }
  };
