import {
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse,
} from '@aws-sdk/client-iotsitewise';
import { createNonNullableList } from '../../utils/createNonNullableList';
import {
  RequestFunction,
  RequestParameters,
  RequestResponse,
} from '../request-fn';
import { noop } from 'lodash';

export type GetAssetPropertyValueHistoryRequestFunction = RequestFunction<
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse
>;

export type RequestSuccessCallback = (
  request: RequestParameters<GetAssetPropertyValueHistoryRequestFunction>,
  response: RequestResponse<GetAssetPropertyValueHistoryRequestFunction>
) => void;

type GetGetAssetPropertyValueHistoryRequestOptions = {
  signal?: AbortSignal;
  requestFunction: GetAssetPropertyValueHistoryRequestFunction;
  onRequestSuccess?: RequestSuccessCallback;
} & RequestParameters<GetAssetPropertyValueHistoryRequestFunction>;

export class GetGetAssetPropertyValueHistoryRequest {
  readonly #requestFunction: GetAssetPropertyValueHistoryRequestFunction;
  readonly #signal: AbortSignal | undefined;
  readonly #request: RequestParameters<GetAssetPropertyValueHistoryRequestFunction>;
  readonly #maxResults = 20000;
  readonly #onRequestSuccess: RequestSuccessCallback;

  constructor({
    signal,
    requestFunction,
    onRequestSuccess,
    ...request
  }: GetGetAssetPropertyValueHistoryRequestOptions) {
    this.#request = {
      ...request,
    };
    this.#requestFunction = requestFunction;
    this.#signal = signal;
    this.#onRequestSuccess = onRequestSuccess ?? noop;
  }

  public async send(): Promise<GetAssetPropertyValueHistoryResponse> {
    let nextToken = undefined;
    const responses: RequestResponse<GetAssetPropertyValueHistoryRequestFunction>[] =
      [];
    try {
      do {
        this.#signal?.throwIfAborted();

        const response = await this.#requestFunction(
          {
            ...this.#request,
            maxResults: this.#maxResults,
          },
          {
            abortSignal: this.#signal,
          }
        );

        nextToken = response.nextToken;

        this.#onRequestSuccess(this.#request, response);

        responses.push(response);
      } while (nextToken);

      const lastResponse = responses.at(-1);

      if (!lastResponse) {
        throw new Error('Error fetching all asset property values');
      }

      const assetPropertyValueHistory = createNonNullableList(
        responses.flatMap(
          ({ assetPropertyValueHistory }) => assetPropertyValueHistory
        )
      );

      return {
        ...lastResponse,
        assetPropertyValueHistory,
      };
    } catch (error) {
      this.#handleError(error);
    }
  }

  #handleError(error: unknown): never {
    console.error(
      `Failed to get asset property value history. Error: ${error}`
    );
    console.info('Request input:');
    console.table(this.#request);

    throw error;
  }
}
