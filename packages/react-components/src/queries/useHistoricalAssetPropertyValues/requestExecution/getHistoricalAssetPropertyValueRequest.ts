import {
  GetAssetPropertyValueHistory,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import { HistoricalAssetPropertyValueRequest } from '../types';

export class GetHistoricalAssetPropertyValueRequest {
  readonly #getAssetPropertyValueHistory: GetAssetPropertyValueHistory;
  readonly #maxResults = 20000;

  constructor({
    getAssetPropertyValueHistory,
  }: {
    getAssetPropertyValueHistory: GetAssetPropertyValueHistory;
  }) {
    this.#getAssetPropertyValueHistory = getAssetPropertyValueHistory;
  }

  public async send(
    { viewport, ...request }: HistoricalAssetPropertyValueRequest,
    settings: { abortSignal: AbortSignal }
  ) {
    try {
      const startDate = viewport && viewportStartDate(viewport);
      const endDate = viewport && viewportEndDate(viewport);
      return await this.#getAssetPropertyValueHistory(
        { startDate, endDate, maxResults: this.#maxResults, ...request },
        settings
      );
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
}
