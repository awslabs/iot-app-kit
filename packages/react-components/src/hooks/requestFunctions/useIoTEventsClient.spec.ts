import { renderHook } from '@testing-library/react';
import { IoTEvents, IoTEventsClient } from '@aws-sdk/client-iot-events';
import type { DescribeAlarmModel } from '@iot-app-kit/core';
import { useIoTEventsClient } from './useIoTEventsClient';

describe('useIoTEventsClient tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('useIoTEventsClient accepts a custom Events client', async () => {
    const describeAlarmModelMock = jest.fn();
    const customEventsClient = {
      describeAlarmModel: (_, __) => {
        describeAlarmModelMock();
      },
    } as IoTEvents;
    const {
      result: { current: iotEventsClient },
    } = renderHook(() =>
      useIoTEventsClient({ iotEventsClient: customEventsClient })
    );

    await iotEventsClient.describeAlarmModel({ alarmModelName: 'alarmModel' });
    expect(describeAlarmModelMock).toBeCalled();
  });

  it('useIoTEventsClient accepts an IoTEvents client', async () => {
    const describeAlarmModelMock = jest.fn();
    const eventsClient = {
      ...new IoTEvents({
        credentials: {
          accessKeyId: '',
          secretAccessKey: '',
          sessionToken: '',
        },
        region: 'us-east-1',
      }),
      describeAlarmModel: describeAlarmModelMock,
    } as unknown as IoTEvents;

    const {
      result: { current: iotEventsClient },
    } = renderHook(() => useIoTEventsClient({ iotEventsClient: eventsClient }));

    await iotEventsClient.describeAlarmModel({ alarmModelName: 'alarmModel' });
    expect(describeAlarmModelMock).toBeCalled();
  });

  it('useIoTEventsClient accepts an IoTEventsClient client', async () => {
    const eventsClient = new IoTEventsClient({});

    const {
      result: { current: iotEventsClient },
    } = renderHook(() => useIoTEventsClient({ iotEventsClient: eventsClient }));

    expect(
      iotEventsClient.describeAlarmModel as DescribeAlarmModel
    ).toBeDefined();
  });
});
