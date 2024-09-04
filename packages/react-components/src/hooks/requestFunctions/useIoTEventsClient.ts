import { IoTEvents, IoTEventsClient } from '@aws-sdk/client-iot-events';
import { useMemo } from 'react';
import { createDescribeAlarmModel } from './data/iotevents';

export interface UseIoTEventsClientOptions {
  iotEventsClient?: IoTEventsClient | IoTEvents;
}

export function useIoTEventsClient({
  iotEventsClient,
}: UseIoTEventsClientOptions): IoTEvents {
  const iotEvents = useMemo(() => {
    if (iotEventsClient instanceof IoTEventsClient) {
      return {
        describeAlarmModel: createDescribeAlarmModel(iotEventsClient),
      } as IoTEvents;
    }

    return iotEventsClient;
  }, [iotEventsClient]);

  return iotEvents as IoTEvents;
}
