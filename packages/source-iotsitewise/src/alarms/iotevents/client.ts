import { IoTEventsClient, DescribeAlarmModelCommand, DescribeAlarmModelResponse } from '@aws-sdk/client-iot-events';

export class EventsClient {
  private readonly eventsSdk: IoTEventsClient;

  constructor(eventsSdk: IoTEventsClient) {
    this.eventsSdk = eventsSdk;
  }

  async getAlarmModel(name: string): Promise<DescribeAlarmModelResponse> {
    return this.eventsSdk.send(
      new DescribeAlarmModelCommand({
        alarmModelName: name,
      })
    );
  }
}
