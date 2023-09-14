import { ComponentUpdateRequest, UpdateEntityCommandInput } from '@aws-sdk/client-iottwinmaker';

import { getGlobalSettings } from '../../common/GlobalSettings';
import { IDataOverlayComponent, KnownComponentType } from '../../interfaces';
import { updateNodeEntityComponent } from '../../utils/entityModelUtils/nodeComponent';
import { updateTagEntityComponent } from '../../utils/entityModelUtils/tagComponent';
import { ISceneComponentInternal, ISceneNodeInternal } from '../internalInterfaces';
import { updateOverlayEntityComponent } from '../../utils/entityModelUtils/overlayComponent';

export const updateEntity = async (
  compToBeUpdated: ISceneComponentInternal,
  node: ISceneNodeInternal,
  layerId: string | undefined,
): Promise<void> => {
  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;
  if (!layerId) {
    return;
  }

  let comp: ComponentUpdateRequest | undefined = undefined;
  switch (compToBeUpdated.type) {
    case KnownComponentType.Tag:
      comp = updateTagEntityComponent(compToBeUpdated);
      break;
    case KnownComponentType.DataOverlay:
      comp = updateOverlayEntityComponent(compToBeUpdated as IDataOverlayComponent);
      break;
  }

  const nodecomp = updateNodeEntityComponent(node, layerId);

  const updateEntity: UpdateEntityCommandInput = {
    workspaceId: undefined,
    entityId: node.ref,
    entityName: node.name + '_' + node.ref,
    componentUpdates: {
      Node: nodecomp,
    },
  };
  if (comp && compToBeUpdated.type !== KnownComponentType.EntityBinding) {
    updateEntity.componentUpdates![compToBeUpdated.type] = comp;
  }

  try {
    await sceneMetadataModule?.updateSceneEntity(updateEntity);
  } catch (e) {
    console.error('Update scene node entity failed', e);
  }
};
