import {
  ExecuteQueryCommand,
  ExecuteQueryCommandOutput,
  ExecuteQueryCommandInput,
  IoTTwinMakerClient,
  ColumnDescription,
  Row,
} from '@aws-sdk/client-iottwinmaker';
import { KGDataModuleInput } from './types';
import { TwinMakerKGQueryDataModule } from '../types';

export class KGDataModule implements TwinMakerKGQueryDataModule {
  private twinMakerClient: IoTTwinMakerClient;
  private workspaceId: string;
  private queryStatement: string;
  private maxResultsCount: number;

  constructor(input: KGDataModuleInput) {
    this.twinMakerClient = input.twinMakerClient;
    this.workspaceId = input.workspaceId;
    this.queryStatement = input.queryStatement;
    if (input.maxResultsCount) this.maxResultsCount = input.maxResultsCount;
  }

  executeQuery = async (): Promise<ExecuteQueryCommandOutput> => {
    const rows: Row[] = [];
    let columnDescriptions: ColumnDescription[] = [];
    let $metadata = {};
    const commandInput: ExecuteQueryCommandInput = {
      workspaceId: this.workspaceId,
      queryStatement: this.queryStatement,
    };
    do {
      const response: ExecuteQueryCommandOutput = await this.twinMakerClient.send(
        new ExecuteQueryCommand(commandInput)
      );
      if (response.rows) {
        rows.push(...response.rows);
      }
      if (response.columnDescriptions && columnDescriptions.length === 0) {
        columnDescriptions = response.columnDescriptions;
      }
      if (response.$metadata && Object.keys($metadata).length === 0) $metadata = response.$metadata;
      commandInput.nextToken = response.nextToken;
    } while (this.maxResultsCount ? commandInput.nextToken && this.maxResultsCount : commandInput.nextToken);
    return { rows, columnDescriptions, $metadata };
  };
}
