import { TimeOrdering } from '@aws-sdk/client-iotsitewise';
import takeRight from 'lodash-es/takeRight';
import { nanoid } from 'nanoid';
import { compact } from '@iot-app-kit/helpers';
import {
  type OnRequestSuccessCallback,
  type SendOptions,
} from '../../../useTimeSeriesData';
import {
  type AssetPropertyAggregatesRequest,
  type AssetPropertyValuesData,
  type BatchGetAssetPropertyAggregatesRequestParameters,
  type BatchGetAssetPropertyAggregatesRequestResponse,
} from '../../types';
import { aggregateToDataPoint } from '../../utils/toDataPoint';

export type BatchGetRequest = {
  options: SendOptions<AssetPropertyAggregatesRequest>;
  onRequestSuccess: OnRequestSuccessCallback<
    AssetPropertyAggregatesRequest,
    AssetPropertyValuesData[number]
  >;
};

export type BatchGetSuccessResponse = NonNullable<
  BatchGetAssetPropertyAggregatesRequestResponse['successEntries']
>[number];
export type BatchGetErrorResponse = NonNullable<
  BatchGetAssetPropertyAggregatesRequestResponse['errorEntries']
>[number];
export type BatchGetEntry = NonNullable<
  BatchGetAssetPropertyAggregatesRequestParameters['entries']
>[number];

export class BatchGetRequestManager {
  private options: SendOptions<AssetPropertyAggregatesRequest>;
  private onRequestSuccess: OnRequestSuccessCallback<
    AssetPropertyAggregatesRequest,
    AssetPropertyValuesData[number]
  >;

  private dataPointNumberTarget: number;

  public assetPropertyValues: AssetPropertyValuesData = [];

  public error?: Omit<BatchGetErrorResponse, 'entryId'>;

  public entryId = nanoid(64);

  public complete = false;

  constructor({ options, onRequestSuccess }: BatchGetRequest) {
    this.options = options;
    this.onRequestSuccess = onRequestSuccess;

    this.dataPointNumberTarget =
      options.request.numberOfDataPointsToScanFor ?? Infinity;
  }

  getRequest(): BatchGetEntry | undefined {
    /**
     * We don't need to fulfill this request if we've already found all
     * the points we needed
     */
    if (this.complete) return;

    const {
      request,
      interval: { start, end },
    } = this.options;
    return {
      ...request,
      entryId: this.entryId,
      endDate: end,
      startDate: start,
      timeOrdering: request.timeOrdering ?? TimeOrdering.DESCENDING,
    };
  }

  processResponse(response: BatchGetAssetPropertyAggregatesRequestResponse) {
    const { errorEntries, successEntries } = response;

    successEntries?.forEach((entry) => {
      if (entry.entryId !== this.entryId) return;

      const assetPropertyAggregateValues = entry.aggregatedValues ?? [];
      const reducedAssetPropertyAggregateValues = takeRight(
        assetPropertyAggregateValues,
        this.dataPointNumberTarget
      );
      this.dataPointNumberTarget -= assetPropertyAggregateValues.length;

      const datapoints = compact(
        reducedAssetPropertyAggregateValues.map(aggregateToDataPoint)
      );

      this.onRequestSuccess(this.options.request, datapoints);
      this.assetPropertyValues.push(...datapoints);

      if (this.dataPointNumberTarget <= 0) {
        this.complete = true;
      }
    });

    errorEntries?.forEach((entry) => {
      if (entry.entryId !== this.entryId) return;

      this.error = {
        errorCode: entry.errorCode,
        errorMessage: entry.errorMessage,
      };
    });
  }

  getResponse() {
    return {
      error: this.error,
      data: this.assetPropertyValues,
    };
  }
}
