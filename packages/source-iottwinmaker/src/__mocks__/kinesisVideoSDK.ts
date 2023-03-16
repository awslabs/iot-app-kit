import { GetDataEndpointCommandInput, GetDataEndpointCommandOutput, KinesisVideoClient } from '@aws-sdk/client-kinesis-video';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockKinesisVideoSDK = ({
  getDataEndpoint = nonOverriddenMock,
}: {
  getDataEndpoint?: (input: GetDataEndpointCommandInput) => Promise<GetDataEndpointCommandOutput>;
} = {}) =>
  ({
    send: (command: { input: any }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'GetDataEndpointCommand':
          return getDataEndpoint(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock KinesisVideo SDK.`
          );
      }
    },
  } as unknown as KinesisVideoClient);
