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
  type AssetPropertyAggregatesRequest,
  type AssetPropertyValuesData,
  type GetAssetPropertyAggregatesRequestFunction,
} from '../types';
import { aggregateToDataPoint } from '../utils/toDataPoint';

export class GetAssetPropertyAggregates
  implements
    ExecuteRequestStrategy<
      AssetPropertyAggregatesRequest,
      AssetPropertyValuesData[number]
    >
{
  private maxResults = 2500;

  private getAssetPropertyAggregates: GetAssetPropertyAggregatesRequestFunction;

  constructor({
    getAssetPropertyAggregates,
  }: {
    getAssetPropertyAggregates: GetAssetPropertyAggregatesRequestFunction;
  }) {
    this.getAssetPropertyAggregates = getAssetPropertyAggregates;
  }

  private handleError(
    request: AssetPropertyAggregatesRequest,
    error: unknown
  ): never {
    console.error(`Failed to get asset property aggregates. Error: ${error}`);
    console.info('Request input:');
    console.table(request);

    throw error;
  }

  public async send(
    {
      request,
      signal,
      interval: { start, end },
    }: SendOptions<AssetPropertyAggregatesRequest>,
    onRequestSuccess: OnRequestSuccessCallback<
      AssetPropertyAggregatesRequest,
      AssetPropertyValuesData[number]
    >
  ): Promise<AssetPropertyValuesData> {
    let dataPointNumberTarget = request.numberOfDataPointsToScanFor ?? Infinity;

    let nextToken = undefined;

    const assetPropertyValues: AssetPropertyValuesData = [];

    try {
      do {
        signal.throwIfAborted();

        const response: RequestResponse<GetAssetPropertyAggregatesRequestFunction> =
          await this.getAssetPropertyAggregates(
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

        const assetPropertyAggregateValues = response.aggregatedValues ?? [];
        const reducedAssetPropertyAggregateValues = takeRight(
          assetPropertyAggregateValues,
          dataPointNumberTarget
        );
        dataPointNumberTarget -= assetPropertyAggregateValues.length;

        const datapoints = compact(
          reducedAssetPropertyAggregateValues.map(aggregateToDataPoint)
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
