import {
  BatchGetAssetPropertyValueCommand,
  BatchGetAssetPropertyValueHistoryCommand,
  DescribeAssetCommand,
  DescribeAssetModelCommand,
  ExecuteQueryCommand,
  GetAssetPropertyValueCommand,
  GetAssetPropertyValueHistoryCommand,
  ListAssetsCommand,
  ListAssetModelsCommand,
  ListAssetModelPropertiesCommand,
  ListAssetPropertiesCommand,
  ListAssociatedAssetsCommand,
  ListTimeSeriesCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import type {
  BatchGetAssetPropertyValue,
  BatchGetAssetPropertyValueHistory,
  DescribeAsset,
  DescribeAssetModel,
  ExecuteQuery,
  GetAssetPropertyValue,
  GetAssetPropertyValueHistory,
  ListAssets,
  ListAssetModels,
  ListAssetModelProperties,
  ListAssetProperties,
  ListAssociatedAssets,
  ListTimeSeries,
} from '@iot-app-kit/core';

/**
 * IoT SiteWise request function implementations
 *
 * Accepts an IoTSiteWiseClient and converts it to a specific
 * API callback that can be resolved with a Promise. In other
 * words, these are converters from the command pattern client
 * to a promise pattern client API.
 *
 * @experimental Do not use in production.
 */

export function createGetAssetPropertyValue(
  client: IoTSiteWiseClient
): GetAssetPropertyValue {
  const getAssetPropertyValue: GetAssetPropertyValue = async (
    request,
    options
  ) => {
    return client.send(new GetAssetPropertyValueCommand(request), options);
  };

  return getAssetPropertyValue;
}

export function createBatchGetAssetPropertyValue(
  client: IoTSiteWiseClient
): BatchGetAssetPropertyValue {
  const batchGetAssetPropertyValue: BatchGetAssetPropertyValue = async (
    request,
    options
  ) => {
    return client.send(new BatchGetAssetPropertyValueCommand(request), options);
  };

  return batchGetAssetPropertyValue;
}

export function createGetAssetPropertyValueHistory(
  client: IoTSiteWiseClient
): GetAssetPropertyValueHistory {
  const getAssetPropertyValueHistory: GetAssetPropertyValueHistory = async (
    request,
    options
  ) => {
    return client.send(
      new GetAssetPropertyValueHistoryCommand(request),
      options
    );
  };

  return getAssetPropertyValueHistory;
}

export function createBatchGetAssetPropertyValueHistory(
  client: IoTSiteWiseClient
): BatchGetAssetPropertyValueHistory {
  const batchGetAssetPropertyValueHistory: BatchGetAssetPropertyValueHistory =
    async (request, options) => {
      return client.send(
        new BatchGetAssetPropertyValueHistoryCommand(request),
        options
      );
    };

  return batchGetAssetPropertyValueHistory;
}

export function createExecuteQuery(client: IoTSiteWiseClient): ExecuteQuery {
  const executeQuery: ExecuteQuery = async (request, options) => {
    return client.send(new ExecuteQueryCommand(request), options);
  };

  return executeQuery;
}

export function createListAssetModels(
  client: IoTSiteWiseClient
): ListAssetModels {
  const listAssetModels: ListAssetModels = async (request, options) => {
    return client.send(new ListAssetModelsCommand(request), options);
  };

  return listAssetModels;
}

export function createListAssetModelProperties(
  client: IoTSiteWiseClient
): ListAssetModelProperties {
  const listAssetModelProperties: ListAssetModelProperties = async (
    request,
    options
  ) => {
    return client.send(new ListAssetModelPropertiesCommand(request), options);
  };

  return listAssetModelProperties;
}

export function createListAssets(client: IoTSiteWiseClient): ListAssets {
  const listAssets: ListAssets = async (request, options) => {
    return client.send(new ListAssetsCommand(request), options);
  };

  return listAssets;
}

export function createListAssociatedAssets(
  client: IoTSiteWiseClient
): ListAssociatedAssets {
  const listAssociatedAssets: ListAssociatedAssets = async (
    request,
    options
  ) => {
    return client.send(new ListAssociatedAssetsCommand(request), options);
  };

  return listAssociatedAssets;
}

export function createListTimeSeries(
  client: IoTSiteWiseClient
): ListTimeSeries {
  const listTimeSeries: ListTimeSeries = async (request, options) => {
    return client.send(new ListTimeSeriesCommand(request), options);
  };

  return listTimeSeries;
}

export function createListAssetProperties(
  client: IoTSiteWiseClient
): ListAssetProperties {
  const listAssetProperties: ListAssetProperties = async (request, options) => {
    return client.send(new ListAssetPropertiesCommand(request), options);
  };

  return listAssetProperties;
}

export function createDescribeAsset(client: IoTSiteWiseClient): DescribeAsset {
  const describeAsset: DescribeAsset = async (request, options) => {
    return client.send(new DescribeAssetCommand(request), options);
  };

  return describeAsset;
}

export function createDescribeAssetModel(
  client: IoTSiteWiseClient
): DescribeAssetModel {
  const describeAssetModel: DescribeAssetModel = async (request, options) => {
    return client.send(new DescribeAssetModelCommand(request), options);
  };

  return describeAssetModel;
}
