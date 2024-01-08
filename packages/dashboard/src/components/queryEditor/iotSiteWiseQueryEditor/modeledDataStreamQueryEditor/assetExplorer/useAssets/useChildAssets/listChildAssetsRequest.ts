import {
  paginateListAssociatedAssets,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class ListChildAssetsRequest {
  readonly #MAX_CHILD_ASSETS_PAGE_SIZE = 250;
  readonly #CHILD_ASSETS_LIST_TRAVERSAL_DIRECTION = 'CHILD';
  readonly #assetId: string;
  readonly #hierarchyId: string;
  readonly #paginator: ReturnType<typeof paginateListAssociatedAssets>;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetId,
    hierarchyId,
    client,
    signal,
  }: {
    assetId: string;
    hierarchyId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#assetId = assetId;
    this.#hierarchyId = hierarchyId;
    this.#paginator = paginateListAssociatedAssets(
      { pageSize: this.#MAX_CHILD_ASSETS_PAGE_SIZE, client },
      {
        assetId,
        hierarchyId,
        traversalDirection: this.#CHILD_ASSETS_LIST_TRAVERSAL_DIRECTION,
      }
    );
    this.#signal = signal;
  }

  public async send() {
    try {
      const assets = [];
      for await (const { assetSummaries = [] } of this.#paginator) {
        if (this.#signal?.aborted) {
          break;
        }

        assets.push(...assetSummaries);
      }

      return assets;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get child assets. Error: ${error}`);
    console.info('Request input:');
    console.table({ assetId: this.#assetId, hierarchyId: this.#hierarchyId });

    throw error;
  }
}
