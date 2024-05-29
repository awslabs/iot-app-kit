import { AssetPropertyValue, TimeOrdering } from '@aws-sdk/client-iotsitewise';
import {
  AssetPropertyValueHistoryData,
  AssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryRequestFunction,
} from '../types';
import { SendOptions } from '../../useTimeSeriesData/requestExecution/types';
import { RequestResponse } from '../../request-fn';
import {
  ExecuteRequestStrategy,
  OnRequestSuccessCallback,
} from '../../useTimeSeriesData/requestExecution/requestExecutionStrategy';
import takeRight from 'lodash.takeright';

export class GetAssetPropertyValueHistory
  implements
    ExecuteRequestStrategy<
      AssetPropertyValueHistoryRequest,
      AssetPropertyValueHistoryData[number]
    >
{
  private maxResults = 20000;

  private getAssetPropertyValueHistory: GetAssetPropertyValueHistoryRequestFunction;

  constructor({
    getAssetPropertyValueHistory,
  }: {
    getAssetPropertyValueHistory: GetAssetPropertyValueHistoryRequestFunction;
  }) {
    this.getAssetPropertyValueHistory = getAssetPropertyValueHistory;
  }

  private handleError(
    request: AssetPropertyValueHistoryRequest,
    error: unknown
  ): never {
    console.error(
      `Failed to get asset property value history. Error: ${error}`
    );
    console.info('Request input:');
    console.table(request);

    throw error;
  }

  public async send(
    {
      request,
      signal,
      interval: { start, end },
    }: SendOptions<AssetPropertyValueHistoryRequest>,
    onRequestSuccess: OnRequestSuccessCallback<
      AssetPropertyValueHistoryRequest,
      AssetPropertyValueHistoryData[number]
    >
  ): Promise<AssetPropertyValue[]> {
    let dataPointNumberTarget = request.numberOfDataPointsToScanFor ?? Infinity;

    let nextToken = undefined;

    const assetPropertyValues: AssetPropertyValue[] = [];

    try {
      do {
        signal.throwIfAborted();

        const response: RequestResponse<GetAssetPropertyValueHistoryRequestFunction> =
          await this.getAssetPropertyValueHistory(
            {
              ...request,
              endDate: end,
              startDate: start,
              maxResults: request.maxResults ?? this.maxResults,
              timeOrdering: request.timeOrdering ?? TimeOrdering.DESCENDING,
              nextToken,
            },
            {
              abortSignal: signal,
            }
          );

        const dataPointsResponse = response.assetPropertyValueHistory ?? [];
        const dataPoints = takeRight(dataPointsResponse, dataPointNumberTarget);
        dataPointNumberTarget -= dataPointsResponse.length;

        onRequestSuccess(request, dataPoints);

        nextToken = response.nextToken;

        assetPropertyValues.push(...dataPoints);
      } while (nextToken && assetPropertyValues.length < dataPointNumberTarget);

      return assetPropertyValues;
    } catch (error) {
      this.handleError(request, error);
    }
  }
}
