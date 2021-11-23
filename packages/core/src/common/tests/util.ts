import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export const createSiteWiseSDK = ({
  getAssetPropertyValue = jest.fn(),
  getAssetPropertyAggregates = jest.fn(),
  getAssetPropertyValueHistory = jest.fn(),
  getInterpolatedAssetPropertyValues = jest.fn(),
}) =>
  (({
    send: (command: { input: Object }) => {
      // Mocks out the process of a sending a command within the JS AWS-SDK v3, learn more at
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html#high-level-concepts
      const commandName = command.constructor.name;

      switch (commandName) {
        case 'GetAssetPropertyValueCommand':
          return getAssetPropertyValue(command.input);
        case 'GetAssetPropertyAggregatesCommand':
          return getAssetPropertyAggregates(command.input);
        case 'GetAssetPropertyValueHistoryCommand':
          return getAssetPropertyValueHistory(command.input);
        case 'GetInterpolatedAssetPropertyValuesCommand':
          return getInterpolatedAssetPropertyValues(command.input);
        default:
          throw new Error(
            `missing mock implementation for command name ${commandName}. Add a new command within the mock SiteWise SDK.`
          );
      }
    },
  } as unknown) as IoTSiteWiseClient);
