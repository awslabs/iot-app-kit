import React, { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { accessStore } from '../store';
import { fetchSceneNodes } from '../utils/entityModelUtils/sceneUtils';
import { KnownSceneProperty } from '../interfaces';

export const SceneLayers: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());
  const autoUpdateInterval = accessStore(sceneComposerId)(
    (state) => state.getSceneProperty(KnownSceneProperty.LayerDefaultRefreshInterval) as number,
  );

  const renderSceneNodes = accessStore(sceneComposerId)((state) => state.renderSceneNodes);

  const sceneRootEntityId = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty(KnownSceneProperty.SceneRootEntityId),
  ) as string;

  const nodes = useQuery({
    enabled: !!sceneRootEntityId,
    queryKey: ['scene-layers', sceneRootEntityId, sceneComposerId],
    queryFn: async () => {
      return await fetchSceneNodes(sceneRootEntityId);
    },
    refetchInterval: (_, query) => {
      return !query.state.error && isViewing ? autoUpdateInterval : 0;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (nodes.data) {
      renderSceneNodes(nodes.data);
    }
  }, [nodes.data, renderSceneNodes]);

  return <></>;
};
