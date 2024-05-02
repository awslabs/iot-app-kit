import React, { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import { processQueries } from '../utils/entityModelUtils/processQueries';
import { KnownSceneProperty } from '../interfaces';
import { DEFAULT_PARENT_RELATIONSHIP_NAME } from '../common/entityModelConstants';

export const SceneLayers: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());
  const autoUpdateInterval = useStore(sceneComposerId)(
    (state) => state.getSceneProperty(KnownSceneProperty.LayerDefaultRefreshInterval) as number,
  );

  const renderSceneNodes = useStore(sceneComposerId)((state) => state.renderSceneNodes);

  const sceneRootEntityId = useStore(sceneComposerId)((state) =>
    state.getSceneProperty(KnownSceneProperty.SceneRootEntityId),
  );

  const nodes = useQuery({
    enabled: !!sceneRootEntityId,
    queryKey: ['scene-layers', sceneRootEntityId, sceneComposerId],
    queryFn: async () => {
      const nodes = await processQueries([
        // Get node entities under the sceneRootEntityId
        `select entity, r, e
          from EntityGraph
          match (entity)-[r]->(e)
          where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
          and e.entityId = '${sceneRootEntityId}'`,

        `select c, r1, entity
          from EntityGraph
          match (c)-[r1]->(entity)-[r]->(e)
          where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
          and e.entityId = '${sceneRootEntityId}'`,

        `select c2, r2, c
          from EntityGraph
          match (c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
          where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
          and e.entityId = '${sceneRootEntityId}'`,

        `select c3, r3, c2
          from EntityGraph
          match (c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
          where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
          and e.entityId = '${sceneRootEntityId}'`,

        `select c4, r4, c3
          from EntityGraph
          match (c4)-[r4]->(c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
          where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
          and e.entityId = '${sceneRootEntityId}'`,
      ]);
      return nodes;
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
