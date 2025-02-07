import {
  BatchGetAssetPropertyValueCommand,
  BatchGetAssetPropertyValueHistoryCommand,
  DescribeAssetCommand,
  DescribeAssetModelCommand,
  ExecuteQueryCommand,
  GetAssetPropertyValueCommand,
  GetAssetPropertyValueHistoryCommand,
  type IoTSiteWiseClient,
  ListAssetModelPropertiesCommand,
  ListAssetModelsCommand,
  ListAssetPropertiesCommand,
  ListAssetsCommand,
  ListAssociatedAssetsCommand,
  ListTimeSeriesCommand,
} from '@aws-sdk/client-iotsitewise';
import type {
  BatchGetAssetPropertyValue,
  BatchGetAssetPropertyValueHistory,
  DescribeAsset,
  DescribeAssetModel,
  ExecuteQuery,
  GetAssetPropertyValue,
  GetAssetPropertyValueHistory,
  ListAssetModelProperties,
  ListAssetModels,
  ListAssetProperties,
  ListAssets,
  ListAssociatedAssets,
  ListTimeSeries,
} from '@iot-app-kit/core';

export function createGetAssetPropertyValue(
  client: IoTSiteWiseClient
): GetAssetPropertyValue {
  return async (request, options) => {
    return client.send(new GetAssetPropertyValueCommand(request), options);
  };
}

export function createBatchGetAssetPropertyValue(
  client: IoTSiteWiseClient
): BatchGetAssetPropertyValue {
  return async (request, options) => {
    return client.send(new BatchGetAssetPropertyValueCommand(request), options);
  };
}

export function createGetAssetPropertyValueHistory(
  client: IoTSiteWiseClient
): GetAssetPropertyValueHistory {
  return async (request, options) => {
    return client.send(
      new GetAssetPropertyValueHistoryCommand(request),
      options
    );
  };
}

export function createBatchGetAssetPropertyValueHistory(
  client: IoTSiteWiseClient
): BatchGetAssetPropertyValueHistory {
  return async (request, options) => {
    return client.send(
      new BatchGetAssetPropertyValueHistoryCommand(request),
      options
    );
  };
}

export function createExecuteQuery(client: IoTSiteWiseClient): ExecuteQuery {
  return async (request, options) => {
    return client.send(new ExecuteQueryCommand(request), options);
  };
}

export function createListAssetModels(
  client: IoTSiteWiseClient
): ListAssetModels {
  return async (request, options) => {
    return client.send(new ListAssetModelsCommand(request), options);
  };
}

export function createListAssetModelProperties(
  client: IoTSiteWiseClient
): ListAssetModelProperties {
  return async (request, options) => {
    return client.send(new ListAssetModelPropertiesCommand(request), options);
  };
}

export function createListAssets(client: IoTSiteWiseClient): ListAssets {
  return async (request, options) => {
    return client.send(new ListAssetsCommand(request), options);
  };
}

export function createListAssociatedAssets(
  client: IoTSiteWiseClient
): ListAssociatedAssets {
  return async (request, options) => {
    return client.send(new ListAssociatedAssetsCommand(request), options);
  };
}

export function createListTimeSeries(
  client: IoTSiteWiseClient
): ListTimeSeries {
  return async (request, options) => {
    return client.send(new ListTimeSeriesCommand(request), options);
  };
}

export function createListAssetProperties(
  client: IoTSiteWiseClient
): ListAssetProperties {
  return async (request, options) => {
    return client.send(new ListAssetPropertiesCommand(request), options);
  };
}

export function createDescribeAsset(client: IoTSiteWiseClient): DescribeAsset {
  return async (request, options) => {
    return client.send(new DescribeAssetCommand(request), options);
  };
}

export function createDescribeAssetModel(
  client: IoTSiteWiseClient
): DescribeAssetModel {
  return async (request, options) => {
    return client.send(new DescribeAssetModelCommand(request), options);
  };
}
