import { type ISceneNodeInternal } from '../../store/internalInterfaces';

import { cloneSceneNodes, createSceneRootEntity, fetchSceneNodes, saveSceneNodes } from './sceneUtils';

export const copySceneNodes = async ({
  sourceSceneRootEntityId,
  sceneCopyId,
  onSuccess,
  onFailure,
}: {
  sourceSceneRootEntityId: string;
  sceneCopyId?: string;
  onSuccess?: (node: ISceneNodeInternal) => void;
  onFailure?: (node: ISceneNodeInternal, error: Error) => void;
}): Promise<string> => {
  const root = await createSceneRootEntity(sceneCopyId);
  const targetSceneRootEntityId = root?.entityId as string;

  const sourceNodes = await fetchSceneNodes(sourceSceneRootEntityId);
  const targetNodes = await cloneSceneNodes(sourceNodes);
  await saveSceneNodes(targetNodes, targetSceneRootEntityId, onSuccess, onFailure);
  return targetSceneRootEntityId;
};
