import DataLoader from 'dataloader';
import { nanoid } from 'nanoid';
import {
  type BatchGetAssetPropertyValueHistory,
  type RequestResponse,
} from '@iot-app-kit/core';
import {
  type HistoricalAssetPropertyValueRequest,
  type HistoricalAssetPropertyValueResponse,
} from '../types';
import { anySignal } from '../../useAssetPropertyValues/requestExecution/utils/anySignal';
import { type BatchGetAssetPropertyValueHistoryErrorEntry } from '@aws-sdk/client-iotsitewise';
import { BatchResponseProcessor } from './batchResponseProcessor';
import { mapViewport } from './mapViewport';
import { mapTimeOrdering } from './mapTimeOrdering';
import { DEFAULT_MAX_RESULTS } from './constants';

type LoaderRequest = HistoricalAssetPropertyValueRequest & {
  abortSignal: AbortSignal;
};
type LoaderResponse = HistoricalAssetPropertyValueResponse & {
  error?: BatchGetAssetPropertyValueHistoryErrorEntry;
};

const createEntryId = () => nanoid(64);

export type HistoricalAssetPropertyValuesBatcherOptions = {
  batchGetAssetPropertyValueHistory: BatchGetAssetPropertyValueHistory;
  maxNumberOfValues?: number;
  batchSchedulerTimeout?: number;
  batchSize?: number;
};

export class HistoricalAssetPropertyValueBatcher {
  private static instances: {
    [maxNumberOfValues: number]: HistoricalAssetPropertyValueBatcher;
  } = {};

  private maxResults: number;
  private valuesTargetNumber: number;

  private batchSchedulerTimeout: number;
  private batchSize: number;

  private batchGetAssetPropertyValueHistory: BatchGetAssetPropertyValueHistory;

  private loader: DataLoader<LoaderRequest, LoaderResponse>;

  private constructor({
    batchGetAssetPropertyValueHistory,
    batchSchedulerTimeout = 100,
    batchSize = 16,
    maxNumberOfValues = Infinity,
  }: HistoricalAssetPropertyValuesBatcherOptions) {
    this.batchGetAssetPropertyValueHistory = batchGetAssetPropertyValueHistory;
    this.batchSchedulerTimeout = batchSchedulerTimeout;
    this.batchSize = batchSize;
    this.maxResults = Math.min(
      maxNumberOfValues * batchSize,
      DEFAULT_MAX_RESULTS
    );
    this.valuesTargetNumber = maxNumberOfValues;

    this.loader = new DataLoader(this.batchLoaderFn.bind(this), {
      batchScheduleFn: this.batchScheduleFn.bind(this),
      cache: false, // utilize react-query cache instead
      maxBatchSize: this.batchSize,
    });
  }

  private handleError(
    requests: readonly HistoricalAssetPropertyValueRequest[],
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
      ({
        abortSignal: _abortSignal,
        viewport,
        fetchMode,
        timeOrdering,
        ...request
      }) => ({
        ...request,
        entryId: createEntryId(),
        ...mapViewport({ viewport, fetchMode }),
        timeOrdering: mapTimeOrdering({ timeOrdering, fetchMode }),
      })
    );

    const abortSignal = anySignal(
      requests.map(({ abortSignal: requestAbortSignal }) => requestAbortSignal)
    );

    const responseProcessors = entries.map(
      (entry) => new BatchResponseProcessor(entry, this.valuesTargetNumber)
    );

    try {
      do {
        abortSignal.throwIfAborted();

        const response: RequestResponse<BatchGetAssetPropertyValueHistory> =
          await this.batchGetAssetPropertyValueHistory(
            {
              entries,
              maxResults: this.maxResults,
              nextToken,
            },
            {
              abortSignal,
            }
          );

        nextToken = response.nextToken;

        responseProcessors.forEach((processor) =>
          processor.processResponse(response)
        );
      } while (
        responseProcessors.some((processor) => !processor.isComplete) &&
        nextToken
      );

      // map this to match the response type of GetAssetPropertyValueHistoryResponse
      // mask the fact that we're batching
      return responseProcessors.map((processor) => {
        return {
          assetPropertyValueHistory: processor.response,
          error: processor.error,
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
    options: HistoricalAssetPropertyValuesBatcherOptions
  ): HistoricalAssetPropertyValueBatcher {
    const maxNumberOfValues = options.maxNumberOfValues ?? Infinity;

    if (!HistoricalAssetPropertyValueBatcher.instances[maxNumberOfValues]) {
      HistoricalAssetPropertyValueBatcher.instances[maxNumberOfValues] =
        new HistoricalAssetPropertyValueBatcher(options);
    }
    return HistoricalAssetPropertyValueBatcher.instances[maxNumberOfValues];
  }

  public async send(
    request: HistoricalAssetPropertyValueRequest,
    settings: { abortSignal: AbortSignal }
  ): Promise<HistoricalAssetPropertyValueResponse> {
    const { assetPropertyValueHistory, error } = await this.loader.load({
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
      assetPropertyValueHistory,
    };
  }
}
