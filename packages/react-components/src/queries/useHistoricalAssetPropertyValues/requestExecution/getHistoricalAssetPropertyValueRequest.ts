import {
  type GetAssetPropertyValueHistory,
  type RequestResponse,
} from '@iot-app-kit/core';
import { type HistoricalAssetPropertyValueRequest } from '../types';
import { take } from 'lodash';
import { mapViewport } from './mapViewport';
import { mapTimeOrdering } from './mapTimeOrdering';
import { DEFAULT_MAX_RESULTS } from './constants';

export class GetHistoricalAssetPropertyValueRequest {
  readonly #getAssetPropertyValueHistory: GetAssetPropertyValueHistory;
  private maxResults: number;
  private valuesTargetNumber: number;

  constructor({
    getAssetPropertyValueHistory,
    maxNumberOfValues = Infinity,
  }: {
    getAssetPropertyValueHistory: GetAssetPropertyValueHistory;
    maxNumberOfValues?: number;
  }) {
    this.#getAssetPropertyValueHistory = getAssetPropertyValueHistory;
    this.maxResults = Math.min(maxNumberOfValues, DEFAULT_MAX_RESULTS);
    this.valuesTargetNumber = maxNumberOfValues;
  }

  public async send(
    { viewport, fetchMode, ...request }: HistoricalAssetPropertyValueRequest,
    settings: { abortSignal: AbortSignal }
  ) {
    let nextToken = undefined;
    const assetPropertyValueHistory: NonNullable<
      RequestResponse<GetAssetPropertyValueHistory>['assetPropertyValueHistory']
    > = [];

    const timeOrdering = mapTimeOrdering({
      fetchMode,
      timeOrdering: request.timeOrdering,
    });

    const { startDate, endDate } = mapViewport({ fetchMode, viewport });

    try {
      do {
        this.#throwIfAborted(settings.abortSignal);

        const response: RequestResponse<GetAssetPropertyValueHistory> =
          await this.#getAssetPropertyValueHistory(
            {
              ...request,
              startDate,
              endDate,
              maxResults: this.maxResults,
              timeOrdering,
              nextToken,
            },
            settings
          );

        nextToken = response.nextToken;

        const assetPropertyValues = response.assetPropertyValueHistory ?? [];
        /**
         * Only take the number of values determined by the target number
         * The target number will be a running count from each paginated
         * resposne.
         */
        const limitedAssetPropertyValues = take(
          assetPropertyValues,
          this.valuesTargetNumber
        );
        this.valuesTargetNumber -= assetPropertyValues.length;

        /**
         * Always return a list in ascending order
         */
        if (timeOrdering === 'ASCENDING') {
          assetPropertyValueHistory.push(...limitedAssetPropertyValues);
        } else {
          assetPropertyValueHistory.unshift(
            ...limitedAssetPropertyValues.reverse()
          );
        }
      } while (this.valuesTargetNumber > 0 && nextToken);

      return { assetPropertyValueHistory };
    } catch (error) {
      this.#handleError(request, error);
    }
  }

  #handleError(
    request: HistoricalAssetPropertyValueRequest,
    error: unknown
  ): never {
    console.error(
      `Failed to get asset property value history. Error: ${error}`
    );
    console.info('Request input:');
    console.table(request);

    throw error;
  }

  #throwIfAborted(abortSignal: AbortSignal) {
    abortSignal.throwIfAborted && abortSignal.throwIfAborted();
  }
}
