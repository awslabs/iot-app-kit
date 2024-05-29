import { GetAssetPropertyValueHistoryRequest } from '@aws-sdk/client-iotsitewise';
import { TimeSeriesDataRequestExecution } from '../../useTimeSeriesData/requestExecution/requestExecution';
import {
  AssetPropertyValueHistoryData,
  AssetPropertyValueHistoryRequest,
} from '../types';
import { GetAssetPropertyValueHistory } from './getAssetPropertyValueHistory';
import { RequestFunctions } from './types';
import { AssetPropertyValueHistoryCacheClient } from '../cacheClient';
import { SendOptions } from '../../useTimeSeriesData/requestExecution/types';
import {
  ExecuteRequestStrategy,
  NoopExecuteRequestStrategy,
  OnRequestSuccessCallback,
} from '../../useTimeSeriesData/requestExecution/requestExecutionStrategy';

type GetAssetPropertyValueHistoryRequestExecutionOptions = RequestFunctions & {
  cacheClient: AssetPropertyValueHistoryCacheClient;
};

export class GetAssetPropertyValueHistoryRequestExecution extends TimeSeriesDataRequestExecution<
  AssetPropertyValueHistoryRequest,
  AssetPropertyValueHistoryData[number]
> {
  private requestExecutionStrategy: ExecuteRequestStrategy<
    AssetPropertyValueHistoryRequest,
    AssetPropertyValueHistoryData[number]
  > = new NoopExecuteRequestStrategy();

  constructor({
    cacheClient,
    getAssetPropertyValueHistory,
  }: GetAssetPropertyValueHistoryRequestExecutionOptions) {
    super({ cacheClient });

    if (getAssetPropertyValueHistory != null) {
      this.requestExecutionStrategy = new GetAssetPropertyValueHistory({
        getAssetPropertyValueHistory,
      });
    }
  }

  async sendRequest(
    sendOptions: SendOptions<GetAssetPropertyValueHistoryRequest>,
    onRequestSuccess: OnRequestSuccessCallback<
      GetAssetPropertyValueHistoryRequest,
      AssetPropertyValueHistoryData[number]
    >
  ): Promise<AssetPropertyValueHistoryData> {
    return await this.requestExecutionStrategy.send(
      sendOptions,
      onRequestSuccess
    );
  }
}
