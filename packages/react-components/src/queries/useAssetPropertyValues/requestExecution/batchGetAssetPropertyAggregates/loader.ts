import DataLoader from 'dataloader';
import {
  type ExecuteRequestStrategy,
  type OnRequestSuccessCallback,
  type SendOptions,
} from '../../../useTimeSeriesData';
import {
  type AssetPropertyAggregatesRequest,
  type AssetPropertyValuesData,
  type BatchGetAssetPropertyAggregatesRequestFunction,
  type BatchGetAssetPropertyAggregatesRequestResponse,
} from '../../types';
import { anySignal } from '../utils/anySignal';
import { type BatchGetRequest, BatchGetRequestManager } from './requestManager';
import { compact } from '@iot-app-kit/helpers';

export type AssetPropertyAggregatesLoaderOptions = {
  batchGetAssetPropertyAggregates: BatchGetAssetPropertyAggregatesRequestFunction;
  batchSchedulerTimeout?: number;
  maxResults?: number;
  batchSize?: number;
};

export class AssetPropertyAggregatesLoader
  implements
    ExecuteRequestStrategy<
      AssetPropertyAggregatesRequest,
      AssetPropertyValuesData[number]
    >
{
  private static instance: AssetPropertyAggregatesLoader;

  private batchSchedulerTimeout: number;
  private maxResults: number;
  private batchSize: number;

  private batchGetAssetPropertyAggregates: BatchGetAssetPropertyAggregatesRequestFunction;

  private loader: DataLoader<
    BatchGetRequest,
    ReturnType<BatchGetRequestManager['getResponse']>
  >;

  private constructor({
    batchGetAssetPropertyAggregates,
    batchSchedulerTimeout = 100,
    maxResults = 4000,
    batchSize = 16,
  }: AssetPropertyAggregatesLoaderOptions) {
    this.batchGetAssetPropertyAggregates = batchGetAssetPropertyAggregates;
    this.batchSchedulerTimeout = batchSchedulerTimeout;
    this.maxResults = maxResults;
    this.batchSize = batchSize;

    this.loader = new DataLoader(this.batchLoaderFn.bind(this), {
      batchScheduleFn: this.batchScheduleFn.bind(this),
      cache: false,
      maxBatchSize: this.batchSize,
    });
  }

  private handleError(
    requests: readonly AssetPropertyAggregatesRequest[],
    error: unknown
  ): never {
    console.error(
      `Failed to batch get asset property value histories. Error: ${error}`
    );
    console.info('Request input:');
    console.table(requests);

    throw error;
  }

  private async batchLoaderFn(
    entries: readonly BatchGetRequest[]
  ): Promise<ReturnType<BatchGetRequestManager['getResponse']>[]> {
    let nextToken = undefined;

    const requests = entries.map((batchRequest) => {
      return new BatchGetRequestManager(batchRequest);
    });

    const abortSignal = anySignal(
      entries.map(({ options: { signal } }) => signal)
    );

    try {
      do {
        const entries = compact(
          requests.map((request) => request.getRequest())
        );
        abortSignal.throwIfAborted();

        const response: BatchGetAssetPropertyAggregatesRequestResponse =
          await this.batchGetAssetPropertyAggregates(
            {
              entries,
              maxResults: this.maxResults,
              nextToken,
            },
            {
              abortSignal,
            }
          );

        requests.forEach((request) => {
          request.processResponse(response);
        });

        nextToken = response.nextToken;
      } while (nextToken && requests.every((request) => !request.complete));

      return requests.map((request) => request.getResponse());
    } catch (error) {
      this.handleError(
        entries.map((entry) => entry.options.request),
        error
      );
    }
  }

  private batchScheduleFn(callback: () => void) {
    return setTimeout(callback, this.batchSchedulerTimeout);
  }

  public static getInstance(
    options: AssetPropertyAggregatesLoaderOptions
  ): AssetPropertyAggregatesLoader {
    if (!AssetPropertyAggregatesLoader.instance) {
      AssetPropertyAggregatesLoader.instance =
        new AssetPropertyAggregatesLoader(options);
    }
    return AssetPropertyAggregatesLoader.instance;
  }

  public async send(
    options: SendOptions<AssetPropertyAggregatesRequest>,
    onRequestSuccess: OnRequestSuccessCallback<
      AssetPropertyAggregatesRequest,
      AssetPropertyValuesData[number]
    >
  ): Promise<AssetPropertyValuesData> {
    const { error, data } = await this.loader.load({
      options,
      onRequestSuccess,
    });
    if (error != null) {
      this.handleError([options.request], error);
    }
    return data;
  }
}
