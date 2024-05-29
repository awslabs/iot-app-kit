import { TimeSeriesDataRequestExecution } from '../../useTimeSeriesData/requestExecution/requestExecution';
import {
  AssetPropertyAggregatesRequest,
  AssetPropertyValueHistoryRequest,
  AssetPropertyValuesData,
  AssetPropertyValuesRequest,
  AssetPropertyValuesRequestFunctions,
} from '../types';
import { GetAssetPropertyValueHistory } from './getAssetPropertyValueHistory';
import { GetAssetPropertyAggregates } from './getAssetPropertyAggregates';
import { AssetPropertyValuesCacheClient } from '../cacheClient';
import { SendOptions } from '../../useTimeSeriesData/requestExecution/types';
import {
  ExecuteRequestStrategy,
  NoopExecuteRequestStrategy,
  OnRequestSuccessCallback,
} from '../../useTimeSeriesData/requestExecution/requestExecutionStrategy';
import { AssetPropertyValueHistoryLoader } from './batchGetAssetPropertyValueHistory';
import { AssetPropertyAggregatesLoader } from './batchGetAssetPropertyAggregates';

const isAggregateRequest = (
  options: SendOptions<AssetPropertyValuesRequest>
): options is SendOptions<AssetPropertyAggregatesRequest> => {
  return (
    'resolution' in options.request &&
    options.request.resolution != null &&
    options.request.resolution !== '0' &&
    'aggregateTypes' in options.request &&
    options.request.aggregateTypes != null
  );
};

type GetAssetPropertyValuesRequestExecutionOptions =
  AssetPropertyValuesRequestFunctions & {
    cacheClient: AssetPropertyValuesCacheClient;
  };

export class GetAssetPropertyValuesRequestExecution extends TimeSeriesDataRequestExecution<
  AssetPropertyValuesRequest,
  AssetPropertyValuesData[number]
> {
  private rawDataRequestExecutionStrategy: ExecuteRequestStrategy<
    AssetPropertyValueHistoryRequest,
    AssetPropertyValuesData[number]
  > = new NoopExecuteRequestStrategy();

  private aggregateDataRequestExecutionStrategy: ExecuteRequestStrategy<
    AssetPropertyAggregatesRequest,
    AssetPropertyValuesData[number]
  > = new NoopExecuteRequestStrategy();

  constructor({
    cacheClient,
    getAssetPropertyValueHistory,
    batchGetAssetPropertyValueHistory,
    getAssetPropertyAggregates,
    batchGetAssetPropertyAggregates,
  }: GetAssetPropertyValuesRequestExecutionOptions) {
    super({ cacheClient });

    if (getAssetPropertyValueHistory != null) {
      this.rawDataRequestExecutionStrategy = new GetAssetPropertyValueHistory({
        getAssetPropertyValueHistory,
      });
    }

    if (batchGetAssetPropertyValueHistory != null) {
      this.rawDataRequestExecutionStrategy =
        AssetPropertyValueHistoryLoader.getInstance({
          batchGetAssetPropertyValueHistory,
        });
    }

    if (getAssetPropertyAggregates != null) {
      this.aggregateDataRequestExecutionStrategy =
        new GetAssetPropertyAggregates({
          getAssetPropertyAggregates,
        });
    }

    if (batchGetAssetPropertyAggregates != null) {
      this.aggregateDataRequestExecutionStrategy =
        AssetPropertyAggregatesLoader.getInstance({
          batchGetAssetPropertyAggregates,
        });
    }
  }

  async sendRequest(
    sendOptions: SendOptions<AssetPropertyValuesRequest>,
    onRequestSuccess: OnRequestSuccessCallback<
      AssetPropertyValuesRequest,
      AssetPropertyValuesData[number]
    >
  ): Promise<AssetPropertyValuesData> {
    if (isAggregateRequest(sendOptions)) {
      return await this.aggregateDataRequestExecutionStrategy.send(
        sendOptions,
        onRequestSuccess
      );
    }

    return await this.rawDataRequestExecutionStrategy.send(
      sendOptions,
      onRequestSuccess
    );
  }
}
