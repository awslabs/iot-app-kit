import { type GetAssetPropertyValue } from '@iot-app-kit/core';
import { type LatestAssetPropertyValueRequest } from '../types';

export class GetLatestAssetPropertyValueRequest {
  readonly #getAssetPropertyValue: GetAssetPropertyValue;

  constructor({
    getAssetPropertyValue,
  }: {
    getAssetPropertyValue: GetAssetPropertyValue;
  }) {
    this.#getAssetPropertyValue = getAssetPropertyValue;
  }

  public async send(
    request: LatestAssetPropertyValueRequest,
    settings: { abortSignal: AbortSignal }
  ) {
    try {
      return await this.#getAssetPropertyValue(request, settings);
    } catch (error) {
      this.#handleError(request, error);
    }
  }

  #handleError(
    request: LatestAssetPropertyValueRequest,
    error: unknown
  ): never {
    console.error(`Failed to get asset property values. Error: ${error}`);
    console.info('Request input:');
    console.table(request);

    throw error;
  }
}
