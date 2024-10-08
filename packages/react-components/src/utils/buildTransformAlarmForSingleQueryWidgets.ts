import { initialize } from '@iot-app-kit/source-iotsitewise';
import { TimeSeriesDataQuery } from '@iot-app-kit/core';
import { AggregateType, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { AlarmData } from '../hooks/useAlarms';
import { parseAlarmStateAssetProperty } from '../hooks/useAlarms/transformers';
import { transformAlarmsToThreshold } from './transformAlarmsToThreshold';
import { mapAlarmRuleExpression } from '../hooks/useAlarms/transformers/mapAlarmRuleExpression';

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
    const {
      inputProperty,
      assetId,
      status,
      state,
      compositeModelName,
      models,
    } = alarm;

    const propertyId = inputProperty?.at(0)?.property.id;
    const latestState = state?.data?.at(-1);

    const severity = models?.at(-1)?.severity;

    let timeSeriesDataQuery: TimeSeriesDataQuery | undefined;
    if (iotSiteWiseClient && iotEventsClient && assetId && propertyId) {
      timeSeriesDataQuery = initialize({
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
    }

    return {
      status,
      alarmName: compositeModelName,
      alarmExpression: mapAlarmRuleExpression(alarm),
      assetId,
      alarmState: parseAlarmStateAssetProperty(latestState)?.value.state,
      timeSeriesDataQueries:
        timeSeriesDataQuery !== undefined ? [timeSeriesDataQuery] : [],
      threshold: transformAlarmsToThreshold(alarm),
      severity,
    };
  };
