import {
  type ExecuteQueryCommandOutput,
  type IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';

import { ExecuteQueryRequest } from './executeQueryRequest';
import { QueryStatementFactory } from './queryStatementFactory';

export async function search({
  workspaceId,
  searchQuery,
  nextToken,
  client,
  signal,
}: {
  workspaceId: string;
  searchQuery: string;
  nextToken?: string;
  client: IoTTwinMakerClient;
  signal?: AbortSignal;
}): Promise<ExecuteQueryCommandOutput | never> {
  const queryStatementFactory = new QueryStatementFactory(searchQuery);
  const queryStatement = queryStatementFactory.create();

  const request = new ExecuteQueryRequest({
    workspaceId,
    queryStatement,
    nextToken,
    client,
    signal,
  });
  const response = await request.send();

  return response;
}
