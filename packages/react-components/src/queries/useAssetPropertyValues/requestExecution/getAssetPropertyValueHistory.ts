import { TimeOrdering } from '@aws-sdk/client-iotsitewise';
import { type RequestResponse } from '@iot-app-kit/core';
import takeRight from 'lodash-es/takeRight';
import { compact } from '@iot-app-kit/helpers';
import {
  type ExecuteRequestStrategy,
  type OnRequestSuccessCallback,
} from '../../useTimeSeriesData/requestExecution/requestExecutionStrategy';
import { type SendOptions } from '../../useTimeSeriesData/requestExecution/types';
import {
  type AssetPropertyValueHistoryRequest,
  type AssetPropertyValuesData,
  type GetAssetPropertyValueHistoryRequestFunction,
} from '../types';
import { toDataPoint } from '../utils/toDataPoint';

export class GetAssetPropertyValueHistory
  implements
    ExecuteRequestStrategy<
      AssetPropertyValueHistoryRequest,
      AssetPropertyValuesData[number]
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
      AssetPropertyValuesData[number]
    >
  ): Promise<AssetPropertyValuesData> {
    let dataPointNumberTarget = request.numberOfDataPointsToScanFor ?? Infinity;

    let nextToken = undefined;

    const assetPropertyValues: AssetPropertyValuesData = [];

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

        const assetPropertyValueHistory =
          response.assetPropertyValueHistory ?? [];
        const reducedAssetPropertyValueHistory = takeRight(
          assetPropertyValueHistory,
          dataPointNumberTarget
        );
        dataPointNumberTarget -= assetPropertyValueHistory.length;

        const datapoints = compact(
          reducedAssetPropertyValueHistory.map(toDataPoint)
        );

        onRequestSuccess(request, datapoints);

        nextToken = response.nextToken;

        assetPropertyValues.push(...datapoints);
      } while (nextToken && assetPropertyValues.length < dataPointNumberTarget);

      return assetPropertyValues;
    } catch (error) {
      this.handleError(request, error);
    }
  }
}
