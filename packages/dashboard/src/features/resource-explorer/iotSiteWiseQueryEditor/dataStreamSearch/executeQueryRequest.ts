import {
  ExecuteQueryCommand,
  type ExecuteQueryCommandInput,
  type IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';

export class ExecuteQueryRequest {
  #command: ExecuteQueryCommand;
  #client: IoTTwinMakerClient;
  #signal?: AbortSignal;

  constructor({
    queryStatement,
    workspaceId,
    nextToken,
    client,
    signal,
  }: {
    queryStatement: NonNullable<ExecuteQueryCommandInput['queryStatement']>;
    workspaceId: NonNullable<ExecuteQueryCommandInput['workspaceId']>;
    nextToken?: string;
    client: IoTTwinMakerClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand({
      queryStatement,
      workspaceId,
      nextToken,
    });
    this.#client = client;
    this.#signal = signal;
  }

  public async send() {
    try {
      const response = await this.#client.send(this.#command, {
        abortSignal: this.#signal,
      });

      return response;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(input: ExecuteQueryCommandInput) {
    const command = new ExecuteQueryCommand(input);

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to execute query. Error: ${error}`);
    console.info('Query input:');
    console.table(this.#command.input);

    throw error;
  }
}
