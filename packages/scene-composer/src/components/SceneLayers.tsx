import React, { useCallback, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

import { getGlobalSettings } from '../common/GlobalSettings';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { accessStore } from '../store';
import { checkIfEntityExists, fetchSceneNodes } from '../utils/entityModelUtils/sceneUtils';
import { KnownSceneProperty } from '../interfaces';
import { DisplayMessageCategory } from '../store/internalInterfaces';

export const SceneLayers: React.FC = () => {
  const { formatMessage } = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());
  const autoUpdateInterval = accessStore(sceneComposerId)(
    (state) => state.getSceneProperty(KnownSceneProperty.LayerDefaultRefreshInterval) as number,
  );

  const renderSceneNodes = accessStore(sceneComposerId)((state) => state.renderSceneNodes);

  const sceneRootEntityId = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty(KnownSceneProperty.SceneRootEntityId),
  ) as string;
  const addMessages = accessStore(sceneComposerId)((state) => state.addMessages);

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

  const checkForSceneRootEntity = useCallback(async () => {
    const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;
    if (sceneMetadataModule) {
      const doesRootEntityExist = await checkIfEntityExists(sceneRootEntityId, sceneMetadataModule);
      if (!doesRootEntityExist) {
        addMessages([
          {
            category: DisplayMessageCategory.Error,
            messageText: formatMessage({
              description: 'Scene Entity Error',
              defaultMessage: 'Dynamic Scene is missing root scene entity',
            }),
          },
        ]);
      }
    }
  }, [sceneRootEntityId, addMessages, formatMessage]);

  useEffect(() => {
    const doAsync = async () => {
      if (nodes.data) {
        if (nodes.data.length === 0) {
          await checkForSceneRootEntity();
        }
        renderSceneNodes(nodes.data);
      }
    };
    doAsync();
  }, [nodes.data, renderSceneNodes, checkForSceneRootEntity]);

  return <></>;
};
