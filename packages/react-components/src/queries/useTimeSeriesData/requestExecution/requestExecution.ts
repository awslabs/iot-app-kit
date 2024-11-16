import { type TimeSeriesDataCacheClient } from '../cacheClient';
import { type OnRequestSuccessCallback } from './requestExecutionStrategy';
import { type SendOptions } from './types';

export type TimeSeriesDataRequestExecutionOptions<Request, Data> = {
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
};

export abstract class TimeSeriesDataRequestExecution<Request, Data> {
  protected cacheClient: TimeSeriesDataCacheClient<Request, Data>;

  constructor({
    cacheClient,
  }: TimeSeriesDataRequestExecutionOptions<Request, Data>) {
    this.cacheClient = cacheClient;
  }

  cacheRequest({ request, interval }: SendOptions<Request>) {
    this.cacheClient.setCachedRequestData(request, interval);
  }

  onRequestSuccess(request: Request, data: Data[]) {
    this.cacheClient.setTimeSeriesRequestData(request, data);
  }

  async send(sendOptions: SendOptions<Request>): Promise<Data[]> {
    const response = await this.sendRequest(
      sendOptions,
      this.onRequestSuccess.bind(this)
    );

    this.cacheRequest(sendOptions);

    return response;
  }

  abstract sendRequest(
    sendOptions: SendOptions<Request>,
    onRequestSuccess: OnRequestSuccessCallback<Request, Data>
  ): Promise<Data[]>;
}
