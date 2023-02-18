import {
  DescribeAssetCommandInput,
  DescribeAssetResponse,
  DescribeAssetPropertyCommandInput,
  DescribeAssetPropertyResponse,
  ListTagsForResourceCommandInput,
  ListTagsForResourceResponse,
  BatchPutAssetPropertyValueCommandInput,
  BatchPutAssetPropertyValueResponse,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export type MockSiteWiseSDKProps = {
  describeAsset?: (input: DescribeAssetCommandInput) => Promise<DescribeAssetResponse>;
  describeAssetProperty?: (input: DescribeAssetPropertyCommandInput) => Promise<DescribeAssetPropertyResponse>;
  listTags?: (input: ListTagsForResourceCommandInput) => Promise<ListTagsForResourceResponse>;
  putAssetPropertyValue?: (
    input: BatchPutAssetPropertyValueCommandInput
  ) => Promise<BatchPutAssetPropertyValueResponse>;
};

type InputProp =
  | DescribeAssetCommandInput
  | DescribeAssetPropertyCommandInput
  | ListTagsForResourceCommandInput
  | BatchPutAssetPropertyValueCommandInput;

export const createMockSiteWiseSDK = ({
  describeAsset = nonOverriddenMock,
  describeAssetProperty = nonOverriddenMock,
  listTags = nonOverriddenMock,
  putAssetPropertyValue = nonOverriddenMock,
}: MockSiteWiseSDKProps = {}) =>
  ({
    send: (command: { input: InputProp }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'DescribeAssetCommand':
          return describeAsset(command.input);
        case 'DescribeAssetPropertyCommand':
          return describeAssetProperty(command.input);
        case 'ListTagsForResourceCommand':
          return listTags(command.input);
        case 'BatchPutAssetPropertyValueCommand':
          return putAssetPropertyValue(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock SiteWise SDK.`
          );
      }
    },
  } as unknown as IoTSiteWiseClient);
