import { initialize } from '@iot-app-kit/source-iotsitewise';
import {
  type AggregateType,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import type { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { type AlarmData } from '../hooks/useAlarms';
import { parseAlarmStateAssetProperty } from '../hooks/useAlarms/transformers';
import { transformAlarmsToThreshold } from './transformAlarmsToThreshold';

// Transforms an AlarmData object into an object containing a timeSeriesDataQuery and alarm state
export const buildTransformAlarmForSingleQueryWidgets =
  ({
    iotSiteWiseClient,
    iotEventsClient,
    aggregationType,
    resolution,
  }: {
    iotSiteWiseClient?: IoTSiteWiseClient;
    iotEventsClient?: IoTEventsClient;
    aggregationType?: AggregateType;
    resolution?: string;
  }) =>
  (alarm: AlarmData) => {
    const { inputProperty, assetId, status, state } = alarm;

    const propertyId = inputProperty?.at(0)?.property.id;
    const latestState = state?.data?.at(-1);

    const timeSeriesDataQuery =
      iotSiteWiseClient &&
      iotEventsClient &&
      assetId &&
      propertyId &&
      initialize({
        iotSiteWiseClient,
        iotEventsClient,
      }).query.timeSeriesData({
        assets: [
          {
            assetId,
            properties: [
              {
                propertyId,
                aggregationType,
                resolution,
              },
            ],
          },
        ],
      });

    return {
      status,
      state: parseAlarmStateAssetProperty(latestState)?.value.state,
      timeSeriesDataQueries: timeSeriesDataQuery ? [timeSeriesDataQuery] : [],
      threshold: transformAlarmsToThreshold(alarm),
    };
  };
