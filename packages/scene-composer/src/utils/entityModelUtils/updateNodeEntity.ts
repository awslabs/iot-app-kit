import { ComponentUpdateRequest, ComponentUpdateType, UpdateEntityCommandInput } from '@aws-sdk/client-iottwinmaker';

import { getGlobalSettings } from '../../common/GlobalSettings';
import {
  ICameraComponent,
  IDataOverlayComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  KnownComponentType,
} from '../../interfaces';
import { ISceneComponentInternal, ISceneNodeInternal } from '../../store/internalInterfaces';
import { componentTypeToId } from '../../common/entityModelConstants';

import { updateNodeEntityComponent } from './nodeComponent';
import { updateTagEntityComponent } from './tagComponent';
import { updateOverlayEntityComponent } from './overlayComponent';
import { updateModelRefComponent } from './modelRefComponent';
import { updateCameraEntityComponent } from './cameraComponent';
import { updateMotionIndicatorEntityComponent } from './motionIndicatorComponent';

export const updateEntity = async (
  node: ISceneNodeInternal,
  compsToBeUpdated?: ISceneComponentInternal[],
  updateType?: ComponentUpdateType,
): Promise<void> => {
  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  const nodecomp = updateNodeEntityComponent(node, undefined, updateType);

  const updateEntity: UpdateEntityCommandInput = {
    workspaceId: undefined,
    entityId: node.ref,
    entityName: node.name + '_' + node.ref,
    componentUpdates: {
      Node: nodecomp,
    },
  };

  compsToBeUpdated?.forEach((compToBeUpdated) => {
    if (compToBeUpdated?.type !== KnownComponentType.EntityBinding) {
      let comp: ComponentUpdateRequest | undefined = undefined;
      if (updateType === ComponentUpdateType.DELETE) {
        comp = {
          componentTypeId: componentTypeToId[compToBeUpdated?.type],
          updateType: updateType,
        };
      } else {
        switch (compToBeUpdated?.type) {
          case KnownComponentType.Tag:
            comp = updateTagEntityComponent(compToBeUpdated);
            break;
          case KnownComponentType.DataOverlay:
            comp = updateOverlayEntityComponent(compToBeUpdated as IDataOverlayComponent);
            break;
          case KnownComponentType.ModelRef:
            comp = updateModelRefComponent(compToBeUpdated as IModelRefComponent);
            break;
          case KnownComponentType.Camera:
            comp = updateCameraEntityComponent(compToBeUpdated as ICameraComponent);
            break;
          case KnownComponentType.MotionIndicator:
            comp = updateMotionIndicatorEntityComponent(compToBeUpdated as IMotionIndicatorComponent);
            break;
          default:
            throw new Error('Component type not supported');
        }
      }

      if (comp) {
        updateEntity.componentUpdates![compToBeUpdated.type] = comp;
      }
    }
  });

  try {
    await sceneMetadataModule?.updateSceneEntity(updateEntity);
  } catch (e) {
    console.error('Update scene node entity failed', e);
  }
};
