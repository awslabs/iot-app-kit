import {
  ExecuteQueryCommand,
  type ExecuteQueryCommandOutput,
  type ExecuteQueryCommandInput,
  type IoTTwinMakerClient,
  type ColumnDescription,
  type Row,
} from '@aws-sdk/client-iottwinmaker';
import { type KGDataModuleInput, type executeQueryParams } from './types';
import { type TwinMakerKGQueryDataModule } from '../types';

export class KGDataModule implements TwinMakerKGQueryDataModule {
  private twinMakerClient: IoTTwinMakerClient;
  private workspaceId: string;

  constructor(input: KGDataModuleInput) {
    this.twinMakerClient = input.twinMakerClient;
    this.workspaceId = input.workspaceId;
  }

  executeQuery = async ({
    queryStatement,
    resultsPerPage,
    maxPagesCount,
  }: executeQueryParams): Promise<ExecuteQueryCommandOutput> => {
    const rows: Row[] = [];
    let columnDescriptions: ColumnDescription[] = [];
    let $metadata = {};
    let pageCounter = 0;
    const commandInput: ExecuteQueryCommandInput = {
      workspaceId: this.workspaceId,
      queryStatement: queryStatement,
      maxResults: resultsPerPage,
    };
    do {
      const response: ExecuteQueryCommandOutput =
        await this.twinMakerClient.send(new ExecuteQueryCommand(commandInput));
      pageCounter = pageCounter + 1;
      if (response.rows) {
        rows.push(...response.rows);
      }
      if (response.columnDescriptions && columnDescriptions.length === 0) {
        columnDescriptions = response.columnDescriptions;
      }
      if (response.$metadata && Object.keys($metadata).length === 0)
        $metadata = response.$metadata;
      commandInput.nextToken = response.nextToken;
    } while (
      maxPagesCount
        ? commandInput.nextToken && pageCounter < maxPagesCount
        : commandInput.nextToken
    );
    return { rows, columnDescriptions, $metadata };
  };
}
