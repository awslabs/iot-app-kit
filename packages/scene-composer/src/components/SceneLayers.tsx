import React, { useContext, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import { processQueries } from '../utils/entityModelUtils/processQueries';
import { KnownSceneProperty } from '../interfaces';
import {
  DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME,
  DEFAULT_LAYER_RELATIONSHIP_NAME,
  SUB_MODEL_REF_PARENT_RELATIONSHIP_NAME,
} from '../common/entityModelConstants';

export const SceneLayers: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());
  const autoUpdateInterval = useStore(sceneComposerId)(
    (state) => state.getSceneProperty(KnownSceneProperty.LayerDefaultRefreshInterval) as number,
  );

  const renderSceneNodesFromLayers = useStore(sceneComposerId)((state) => state.renderSceneNodesFromLayers);
  const layerIds = useStore(sceneComposerId)((state) => state.getSceneProperty<string[]>(KnownSceneProperty.LayerIds));
  const layerId = layerIds?.[0];

  const sceneRootEntityId = useStore(sceneComposerId)(
    (state) => state.getSceneProperty(KnownSceneProperty.SceneRootEntityId),
  ) 

  const nodes = useQuery({
    enabled: !!sceneRootEntityId,
    queryKey: ['scene-layers', sceneRootEntityId, sceneComposerId],
    queryFn: async () => {
      const nodes = await processQueries(
        [
          // Get node entities under the sceneRootEntityId
          `select entity, r, e
          from EntityGraph
          match (entity)-[r]->(e)
          where r.relationshipName = 'isChildOf'
          and e.entityId = '${sceneRootEntityId}'`, 

          `select c, r, entity
          from EntityGraph
          match (c)-[r]->(entity)-[r]->(e)
          where r.relationshipName = 'isChildOf'
          and e.entityId = '${sceneRootEntityId}'`,

          `select c2, r, c
          from EntityGraph
          match (c2)-[r]->(c)-[r]->(entity)-[r]->(e)
          where r.relationshipName = 'isChildOf'
          and e.entityId = '${sceneRootEntityId}'`,

          `select c3, r, c2
          from EntityGraph
          match (c3)-[r]->(c2)-[r]->(c)-[r]->(entity)-[r]->(e)
          where r.relationshipName = 'isChildOf'
          and e.entityId = '${sceneRootEntityId}'`,

          `select c4, r, c3
          from EntityGraph
          match (c4)-[r]->(c3)-[r]->(c2)-[r]->(c)-[r]->(entity)-[r]->(e)
          where r.relationshipName = 'isChildOf'
          and e.entityId = '${sceneRootEntityId}'`
        ],
      );
      return nodes;
    },
    refetchInterval: (_, query) => {
      return !query.state.error && isViewing ? autoUpdateInterval : 0;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (nodes.data) {
      renderSceneNodesFromLayers(nodes.data, layerId!);
    }
  }, [nodes.data, renderSceneNodesFromLayers]);

  return <></>;
};