import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
export type KGDataModuleInput = {
  workspaceId: string;
  twinMakerClient: IoTTwinMakerClient;
};
export type executeQueryParams = {
  queryStatement: string;
  resultsPerPage?: number;
  maxPagesCount?: number;
};
