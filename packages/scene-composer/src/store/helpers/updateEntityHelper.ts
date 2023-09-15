import { ComponentUpdateRequest, ComponentUpdateType, UpdateEntityCommandInput } from '@aws-sdk/client-iottwinmaker';

import { getGlobalSettings } from '../../common/GlobalSettings';
import { IDataOverlayComponent, KnownComponentType } from '../../interfaces';
import { updateNodeEntityComponent } from '../../utils/entityModelUtils/nodeComponent';
import { updateTagEntityComponent } from '../../utils/entityModelUtils/tagComponent';
import { ISceneComponentInternal, ISceneNodeInternal } from '../internalInterfaces';
import { updateOverlayEntityComponent } from '../../utils/entityModelUtils/overlayComponent';

export const updateEntity = async (
  node: ISceneNodeInternal,
  compToBeUpdated?: ISceneComponentInternal,
  updateType?: ComponentUpdateType
): Promise<void> => {
  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;
  let index = node.components.findIndex((c) => c.ref === compToBeUpdated?.ref)
  const entityBindingFromType = node.components?.find((component) => component.type === "EntityBinding");
  const fromIndex = node.components[index]
  console.log({entityBinding: entityBindingFromType}, {fromIndex})
  let comp: ComponentUpdateRequest | undefined = undefined;
  switch (compToBeUpdated?.type) {
    case KnownComponentType.Tag:
      comp = updateTagEntityComponent(compToBeUpdated, updateType);
      break;
    case KnownComponentType.DataOverlay:
      comp = updateOverlayEntityComponent(compToBeUpdated as IDataOverlayComponent, updateType);
      break;
  }
  const nodecomp = updateNodeEntityComponent(node, undefined, comp ? undefined : updateType);

  const updateEntity: UpdateEntityCommandInput = {
    workspaceId: undefined,
    entityId: node.ref,
    entityName: node.name + '_' + node.ref,
    componentUpdates: {
      Node: nodecomp
    },
  };

  if (comp && compToBeUpdated && compToBeUpdated.type !== KnownComponentType.EntityBinding) {
    updateEntity.componentUpdates![compToBeUpdated.type] = comp;
  }
  try {
    await sceneMetadataModule?.updateSceneEntity(updateEntity);
  } catch (e) {
    console.error('Update scene node entity failed', e);
  }
};
