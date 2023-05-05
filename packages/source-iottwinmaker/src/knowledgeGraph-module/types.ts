import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
export type KGDataModuleInput = {
  workspaceId: string;
  twinMakerClient: IoTTwinMakerClient;
  queryStatement: string;
  maxResultsCount?: number;
};
