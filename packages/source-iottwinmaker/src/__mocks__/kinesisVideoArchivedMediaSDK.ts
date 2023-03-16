import { GetHLSStreamingSessionURLCommandInput, GetHLSStreamingSessionURLCommandOutput, KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockKinesisVideoArchivedMediaSDK = ({
  getHLSStreamingSessionURL = nonOverriddenMock,
}: {
  getHLSStreamingSessionURL?: (input: GetHLSStreamingSessionURLCommandInput) => Promise<GetHLSStreamingSessionURLCommandOutput>;
} = {}) =>
  ({
    send: (command: { input: any }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'GetHLSStreamingSessionURLCommand':
          return getHLSStreamingSessionURL(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock KinesisVideoArchivedMedia SDK.`
          );
      }
    },
    config: {
      endpoint: 'testEndpoint',
    },
  } as unknown as KinesisVideoArchivedMediaClient);
