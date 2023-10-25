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

  const nodes = useQuery({
    enabled: !isEmpty(layerIds),
    queryKey: ['scene-layers', layerIds, sceneComposerId],
    queryFn: async () => {
      const nodes = await processQueries(
        [
          `SELECT entity, r, e
        FROM EntityGraph 
        MATCH (entity)-[r]->(e)
        WHERE (r.relationshipName = '${DEFAULT_LAYER_RELATIONSHIP_NAME}'
        AND e.entityId = '${layerId}')
        OR r.relationshipName = '${DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME}'`,
        ],
        (node) => (node.properties.layerIds = [...(node.properties.layerIds ?? []), layerId!]),
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
