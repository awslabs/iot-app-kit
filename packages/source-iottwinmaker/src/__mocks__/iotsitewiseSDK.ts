import {
  GetAssetPropertyValueCommandInput,
  GetAssetPropertyValueResponse,
  GetInterpolatedAssetPropertyValuesCommandInput,
  GetInterpolatedAssetPropertyValuesResponse,
  IoTSiteWiseClient,
  BatchPutAssetPropertyValueCommandInput,
  BatchPutAssetPropertyValueCommandOutput,
} from '@aws-sdk/client-iotsitewise';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockSiteWiseSDK = ({
  batchPutAssetPropertyValue = nonOverriddenMock,
  getAssetPropertyValue = nonOverriddenMock,
  getInterpolatedAssetPropertyValues = nonOverriddenMock,
}: {
  batchPutAssetPropertyValue?: (input: BatchPutAssetPropertyValueCommandInput) => Promise<BatchPutAssetPropertyValueCommandOutput>;
  getAssetPropertyValue?: (input: GetAssetPropertyValueCommandInput) => Promise<GetAssetPropertyValueResponse>;
  getInterpolatedAssetPropertyValues?: (
    input: GetInterpolatedAssetPropertyValuesCommandInput
  ) => Promise<GetInterpolatedAssetPropertyValuesResponse>;
} = {}) =>
  ({
    send: (command: { input: any }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'BatchPutAssetPropertyValueCommand':
          return batchPutAssetPropertyValue(command.input);
        case 'GetAssetPropertyValueCommand':
          return getAssetPropertyValue(command.input);
        case 'GetInterpolatedAssetPropertyValuesCommand':
          return getInterpolatedAssetPropertyValues(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock SiteWise SDK.`
          );
      }
    },
  } as unknown as IoTSiteWiseClient);
