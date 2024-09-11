import { IoTEvents, IoTEventsClient } from '@aws-sdk/client-iot-events';
import { useMemo } from 'react';
import { createDescribeAlarmModel } from './data/iotevents';

/**
 * Hook interface accepts any AWS SDK client type for IoT Events
 */
export interface UseIoTEventsClientOptions {
  iotEventsClient?: IoTEventsClient | IoTEvents;
}

/**
 *
 * @param iotEventsClient is an AWS SDK client type for IoT Events
 * @returns an IoTEvents type, promise pattern client
 *
 * @experimental Do not use in production.
 */
export function useIoTEventsClient({
  iotEventsClient,
}: UseIoTEventsClientOptions): IoTEvents {
  const iotEvents = useMemo(() => {
    if (iotEventsClient instanceof IoTEventsClient) {
      return {
        describeAlarmModel: createDescribeAlarmModel(iotEventsClient),
      } as IoTEvents;
    }

    return iotEventsClient ?? {};
  }, [iotEventsClient]);

  return iotEvents as IoTEvents;
}
