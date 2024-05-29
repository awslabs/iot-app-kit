import { TimeOrdering } from '@aws-sdk/client-iotsitewise';
import {
  OnRequestSuccessCallback,
  SendOptions,
} from '../../../useTimeSeriesData';
import {
  AssetPropertyValueHistoryRequest,
  AssetPropertyValuesData,
  BatchGetAssetPropertyValueHistoryRequestParameters,
  BatchGetAssetPropertyValueHistoryRequestResponse,
} from '../../types';
import { nanoid } from 'nanoid';
import takeRight from 'lodash.takeright';
import { createNonNullableList } from '../../../../utils/createNonNullableList';
import { toDataPoint } from '../../utils/toDataPoint';

export type BatchGetRequest = {
  options: SendOptions<AssetPropertyValueHistoryRequest>;
  onRequestSuccess: OnRequestSuccessCallback<
    AssetPropertyValueHistoryRequest,
    AssetPropertyValuesData[number]
  >;
};

export type BatchGetSuccessResponse = NonNullable<
  BatchGetAssetPropertyValueHistoryRequestResponse['successEntries']
>[number];
export type BatchGetErrorResponse = NonNullable<
  BatchGetAssetPropertyValueHistoryRequestResponse['errorEntries']
>[number];
export type BatchGetEntry = NonNullable<
  BatchGetAssetPropertyValueHistoryRequestParameters['entries']
>[number];

export class BatchGetRequestManager {
  private options: SendOptions<AssetPropertyValueHistoryRequest>;
  private onRequestSuccess: OnRequestSuccessCallback<
    AssetPropertyValueHistoryRequest,
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

  processResponse(response: BatchGetAssetPropertyValueHistoryRequestResponse) {
    const { errorEntries, successEntries } = response;

    successEntries?.forEach((entry) => {
      if (entry.entryId !== this.entryId) return;

      const assetPropertyValueHistory = entry.assetPropertyValueHistory ?? [];
      const reducedAssetPropertyValueHistory = takeRight(
        assetPropertyValueHistory,
        this.dataPointNumberTarget
      );
      this.dataPointNumberTarget -= assetPropertyValueHistory.length;

      const datapoints = createNonNullableList(
        reducedAssetPropertyValueHistory.map(toDataPoint)
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
