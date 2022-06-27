import {
  DescribeAlarmModelCommandInput,
  DescribeAlarmModelResponse,
  IoTEventsClient
} from '@aws-sdk/client-iot-events';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockIoTEventsSDK = ({
  getAlarmModel = nonOverriddenMock,
}: {
  getAlarmModel?: (input: DescribeAlarmModelCommandInput) => Promise<DescribeAlarmModelResponse>;
} = {}) =>
  ({
    send: (command: { input: any }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'DescribeAlarmModelCommand':
          return getAlarmModel(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock SiteWise SDK.`
          );
      }
    },
  } as unknown as IoTEventsClient);
