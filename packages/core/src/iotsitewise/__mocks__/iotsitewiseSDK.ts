import {
  DescribeAssetCommandInput,
  DescribeAssetModelCommandInput,
  DescribeAssetModelResponse,
  DescribeAssetResponse,
  GetAssetPropertyAggregatesCommandInput,
  GetAssetPropertyAggregatesResponse,
  GetAssetPropertyValueCommandInput,
  GetAssetPropertyValueHistoryCommandInput,
  GetAssetPropertyValueHistoryResponse,
  GetAssetPropertyValueResponse,
  GetInterpolatedAssetPropertyValuesCommandInput,
  GetInterpolatedAssetPropertyValuesResponse,
  IoTSiteWiseClient,
  ListAssetsCommandInput,
  ListAssociatedAssetsCommandInput,
  ListAssociatedAssetsResponse,
} from '@aws-sdk/client-iotsitewise';
import { ListAssetsResponse } from '@aws-sdk/client-iotsitewise/dist-types/models/models_0';

const nonOverriddenMock = () => Promise.reject(new Error('Mock method not override.'));

export const createMockSiteWiseSDK = ({
  listAssets = nonOverriddenMock,
  listAssociatedAssets = nonOverriddenMock,
  describeAsset = nonOverriddenMock,
  describeAssetModel = nonOverriddenMock,
  getAssetPropertyValue = nonOverriddenMock,
  getAssetPropertyAggregates = nonOverriddenMock,
  getAssetPropertyValueHistory = nonOverriddenMock,
  getInterpolatedAssetPropertyValues = nonOverriddenMock,
}: {
  listAssets?: (input: ListAssetsCommandInput) => Promise<ListAssetsResponse>;
  listAssociatedAssets?: (input: ListAssociatedAssetsCommandInput) => Promise<ListAssociatedAssetsResponse>;
  describeAsset?: (input: DescribeAssetCommandInput) => Promise<DescribeAssetResponse>;
  describeAssetModel?: (input: DescribeAssetModelCommandInput) => Promise<DescribeAssetModelResponse>;
  getAssetPropertyValue?: (input: GetAssetPropertyValueCommandInput) => Promise<GetAssetPropertyValueResponse>;
  getAssetPropertyAggregates?: (
    input: GetAssetPropertyAggregatesCommandInput
  ) => Promise<GetAssetPropertyAggregatesResponse>;
  getAssetPropertyValueHistory?: (
    input: GetAssetPropertyValueHistoryCommandInput
  ) => Promise<GetAssetPropertyValueHistoryResponse>;
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
        case 'ListAssetsCommand':
          return listAssets(command.input);
        case 'ListAssociatedAssetsCommand':
          return listAssociatedAssets(command.input);
        case 'DescribeAssetCommand':
          return describeAsset(command.input);
        case 'DescribeAssetModelCommand':
          return describeAssetModel(command.input);
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
  } as unknown as IoTSiteWiseClient);
