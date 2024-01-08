import { TwinMakerPropertyValueQuery } from '../common/queryTypes';

export type TwinMakerStaticDataQuery = TwinMakerPropertyValueQuery & {
  workspaceId: string;
};
