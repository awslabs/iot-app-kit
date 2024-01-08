import {
  paginateListWorkspaces,
  type IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';

export class ListWorkspacesRequest {
  readonly #MAX_WORKSPACES_PAGE_SIZE = 200;
  readonly #paginator: ReturnType<typeof paginateListWorkspaces>;
  readonly #signal: AbortSignal | undefined;

  constructor({
    client,
    signal,
  }: {
    client: IoTTwinMakerClient;
    signal?: AbortSignal;
  }) {
    this.#paginator = this.#createPaginator(client);
    this.#signal = signal;
  }

  public async send() {
    try {
      const workspaces = [];
      for await (const { workspaceSummaries = [] } of this.#paginator) {
        if (this.#signal?.aborted) {
          break;
        }

        workspaces.push(...workspaceSummaries);
      }

      return workspaces;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createPaginator(client: IoTTwinMakerClient) {
    const paginator = paginateListWorkspaces(
      { pageSize: this.#MAX_WORKSPACES_PAGE_SIZE, client },
      {}
    );

    return paginator;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to list workspaces. Error: ${error}`);

    throw error;
  }
}
