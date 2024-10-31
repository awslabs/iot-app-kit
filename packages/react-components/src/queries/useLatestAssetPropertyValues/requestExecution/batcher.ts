import DataLoader from 'dataloader';
import { nanoid } from 'nanoid';
import { BatchGetAssetPropertyValue, RequestResponse } from '@iot-app-kit/core';
import {
  LatestAssetPropertyValueRequest,
  LatestAssetPropertyValueResponse,
} from '../types';
import { anySignal } from '../../useAssetPropertyValues/requestExecution/utils/anySignal';
import { BatchGetAssetPropertyValueErrorEntry } from '@aws-sdk/client-iotsitewise';

type LoaderRequest = LatestAssetPropertyValueRequest & {
  abortSignal: AbortSignal;
};
type LoaderResponse = LatestAssetPropertyValueResponse & {
  error?: BatchGetAssetPropertyValueErrorEntry;
};

const createEntryId = () => nanoid(64);

export type LatestAssetPropertyValuesBatcherOptions = {
  batchGetAssetPropertyValue: BatchGetAssetPropertyValue;
  batchSchedulerTimeout?: number;
  batchSize?: number;
};

export class LatestAssetPropertyValueBatcher {
  private static instance: LatestAssetPropertyValueBatcher;

  private batchSchedulerTimeout: number;
  private batchSize: number;

  private batchGetAssetPropertyValue: BatchGetAssetPropertyValue;

  private loader: DataLoader<LoaderRequest, LoaderResponse>;

  private constructor({
    batchGetAssetPropertyValue,
    batchSchedulerTimeout = 100,
    batchSize = 128,
  }: LatestAssetPropertyValuesBatcherOptions) {
    this.batchGetAssetPropertyValue = batchGetAssetPropertyValue;
    this.batchSchedulerTimeout = batchSchedulerTimeout;
    this.batchSize = batchSize;

    this.loader = new DataLoader(this.batchLoaderFn.bind(this), {
      batchScheduleFn: this.batchScheduleFn.bind(this),
      cache: false, // utilize react-query cache instead
      maxBatchSize: this.batchSize,
    });
  }

  private handleError(
    requests: readonly LatestAssetPropertyValueRequest[],
    error: unknown
  ): never {
    console.error(`Failed to batch get asset property values. Error: ${error}`);
    console.info('Request input:');
    console.table(requests);

    throw error;
  }

  private async batchLoaderFn(
    requests: readonly LoaderRequest[]
  ): Promise<LoaderResponse[]> {
    let nextToken = undefined;

    const entries = requests.map(
      ({ abortSignal: _abortSignal, ...request }) => ({
        ...request,
        entryId: createEntryId(),
      })
    );

    const abortSignal = anySignal(
      requests.map(({ abortSignal: requestAbortSignal }) => requestAbortSignal)
    );

    let successEntries: RequestResponse<BatchGetAssetPropertyValue>['successEntries'] =
      [];
    let errorEntries: RequestResponse<BatchGetAssetPropertyValue>['errorEntries'] =
      [];

    try {
      do {
        abortSignal.throwIfAborted();

        const response: RequestResponse<BatchGetAssetPropertyValue> =
          await this.batchGetAssetPropertyValue(
            {
              entries,
              nextToken,
            },
            {
              abortSignal,
            }
          );

        successEntries = [
          ...successEntries,
          ...(response.successEntries ?? []),
        ];
        errorEntries = [...errorEntries, ...(response.errorEntries ?? [])];

        nextToken = response.nextToken;
      } while (nextToken);

      // map this to match the response type of GetAssetPropertyValueResponse
      // mask the fact that we're batching
      return entries.map(({ entryId }) => {
        return {
          propertyValue: successEntries?.find(
            (successEntry) => successEntry.entryId === entryId
          )?.assetPropertyValue,
          error: errorEntries?.find(
            (errorEntry) => errorEntry.entryId === entryId
          ),
        };
      });
    } catch (error) {
      this.handleError(entries, error);
    }
  }

  private batchScheduleFn(callback: () => void) {
    return setTimeout(callback, this.batchSchedulerTimeout);
  }

  public static getInstance(
    options: LatestAssetPropertyValuesBatcherOptions
  ): LatestAssetPropertyValueBatcher {
    if (!LatestAssetPropertyValueBatcher.instance) {
      LatestAssetPropertyValueBatcher.instance =
        new LatestAssetPropertyValueBatcher(options);
    }
    return LatestAssetPropertyValueBatcher.instance;
  }

  public async send(
    request: LatestAssetPropertyValueRequest,
    settings: { abortSignal: AbortSignal }
  ): Promise<LatestAssetPropertyValueResponse> {
    const { propertyValue, error } = await this.loader.load({
      ...request,
      ...settings,
    });

    /**
     * Handle error for each individual invocation of
     * the loader so that other requests can succeed
     */
    if (error) {
      this.handleError([request], error);
    }

    return {
      propertyValue,
    };
  }
}
