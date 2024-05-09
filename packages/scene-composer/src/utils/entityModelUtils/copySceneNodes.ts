import { ISceneNodeInternal } from '../../store/internalInterfaces';

import { cloneSceneNodes, createSceneRootEntity, fetchSceneNodes, saveSceneNodes } from './sceneUtils';

export const copySceneNodes = async ({
  sourceSceneRootEntityId,
  onSuccess,
  onFailure,
}: {
  sourceSceneRootEntityId: string;
  onSuccess?: (node: ISceneNodeInternal) => void;
  onFailure?: (node: ISceneNodeInternal, error: Error) => void;
}): Promise<string> => {
  const root = await createSceneRootEntity();
  const targetSceneRootEntityId = root?.entityId as string;

  const sourceNodes = await fetchSceneNodes(sourceSceneRootEntityId);
  const targetNodes = await cloneSceneNodes(sourceNodes);
  await saveSceneNodes(targetNodes, targetSceneRootEntityId, onSuccess, onFailure);
  return targetSceneRootEntityId;
};
