import { cloneSceneNodes, createSceneRootEntity, fetchSceneNodes, saveSceneNodes } from './sceneUtils';

export const copySceneNodes = async (sourceSceneRootEntityId: string): Promise<string> => {
  const root = await createSceneRootEntity();
  const targetSceneRootEntityId = root?.entityId as string;

  const sourceNodes = await fetchSceneNodes(sourceSceneRootEntityId);
  const targetNodes = await cloneSceneNodes(sourceNodes);
  await saveSceneNodes(targetNodes, targetSceneRootEntityId);
  return targetSceneRootEntityId;
};
