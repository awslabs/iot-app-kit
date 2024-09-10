import DataLoader from 'dataloader';
import { nanoid } from 'nanoid';
import {
  BatchGetAssetPropertyValueHistory,
  RequestResponse,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import {
  HistoricalAssetPropertyValueRequest,
  HistoricalAssetPropertyValueResponse,
} from '../types';
import { anySignal } from '../../useAssetPropertyValues/requestExecution/utils/anySignal';
import { BatchGetAssetPropertyValueHistoryErrorEntry } from '@aws-sdk/client-iotsitewise';

type LoaderRequest = HistoricalAssetPropertyValueRequest & {
  abortSignal: AbortSignal;
};
type LoaderResponse = HistoricalAssetPropertyValueResponse & {
  error?: BatchGetAssetPropertyValueHistoryErrorEntry;
};

const createEntryId = () => nanoid(64);

export type HistoricalAssetPropertyValuesBatcherOptions = {
  batchGetAssetPropertyValueHistory: BatchGetAssetPropertyValueHistory;
  batchSchedulerTimeout?: number;
  batchSize?: number;
};

export class HistoricalAssetPropertyValueBatcher {
  private static instance: HistoricalAssetPropertyValueBatcher;

  private maxResults = 20000;

  private batchSchedulerTimeout: number;
  private batchSize: number;

  private batchGetAssetPropertyValueHistory: BatchGetAssetPropertyValueHistory;

  private loader: DataLoader<LoaderRequest, LoaderResponse>;

  private constructor({
    batchGetAssetPropertyValueHistory,
    batchSchedulerTimeout = 100,
    batchSize = 16,
  }: HistoricalAssetPropertyValuesBatcherOptions) {
    this.batchGetAssetPropertyValueHistory = batchGetAssetPropertyValueHistory;
    this.batchSchedulerTimeout = batchSchedulerTimeout;
    this.batchSize = batchSize;

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

    const entries = requests.map(({ viewport, ...request }) => ({
      ...request,
      startDate: viewport && viewportStartDate(viewport),
      endDate: viewport && viewportEndDate(viewport),
      entryId: createEntryId(),
    }));

    const abortSignal = anySignal(
      requests.map(({ abortSignal: requestAbortSignal }) => requestAbortSignal)
    );

    let successEntries: RequestResponse<BatchGetAssetPropertyValueHistory>['successEntries'] =
      [];
    let errorEntries: RequestResponse<BatchGetAssetPropertyValueHistory>['errorEntries'] =
      [];

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

        successEntries = [
          ...successEntries,
          ...(response.successEntries ?? []),
        ];
        errorEntries = [...errorEntries, ...(response.errorEntries ?? [])];

        nextToken = response.nextToken;
      } while (nextToken);

      // map this to match the response type of GetAssetPropertyValueHistoryResponse
      // mask the fact that we're batching
      return entries.map(({ entryId }) => {
        return {
          assetPropertyValueHistory: successEntries
            ?.filter((successEntry) => successEntry.entryId === entryId)
            .flatMap((entry) => entry.assetPropertyValueHistory ?? []),
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
    options: HistoricalAssetPropertyValuesBatcherOptions
  ): HistoricalAssetPropertyValueBatcher {
    if (!HistoricalAssetPropertyValueBatcher.instance) {
      HistoricalAssetPropertyValueBatcher.instance =
        new HistoricalAssetPropertyValueBatcher(options);
    }
    return HistoricalAssetPropertyValueBatcher.instance;
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
