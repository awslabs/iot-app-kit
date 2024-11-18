import { TimeOrdering } from '@aws-sdk/client-iotsitewise';
import {
  type AssetPropertyAggregatesRequest,
  type AssetPropertyValuesData,
  type GetAssetPropertyAggregatesRequestFunction,
} from '../types';
import { type SendOptions } from '../../useTimeSeriesData/requestExecution/types';
import { type RequestResponse } from '@iot-app-kit/core';
import {
  type ExecuteRequestStrategy,
  type OnRequestSuccessCallback,
} from '../../useTimeSeriesData/requestExecution/requestExecutionStrategy';
import takeRight from 'lodash.takeright';
import { aggregateToDataPoint } from '../utils/toDataPoint';
import { createNonNullableList } from '../../../utils/createNonNullableList';

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

        const datapoints = createNonNullableList(
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
