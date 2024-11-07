import { type DeleteEntityCommandOutput } from '@aws-sdk/client-iottwinmaker';

import { getGlobalSettings } from '../../common/GlobalSettings';

export const deleteNodeEntity = (entityId: string): Promise<DeleteEntityCommandOutput> | undefined => {
  return getGlobalSettings().twinMakerSceneMetadataModule?.deleteSceneEntity({ entityId, isRecursive: true });
};
