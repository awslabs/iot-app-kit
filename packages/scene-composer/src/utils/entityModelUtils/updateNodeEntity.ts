import { ComponentUpdateRequest, ComponentUpdateType, UpdateEntityCommandInput } from '@aws-sdk/client-iottwinmaker';

import { getGlobalSettings } from '../../common/GlobalSettings';
import {
  ICameraComponent,
  IColorOverlayComponent,
  IDataOverlayComponent,
  ILightComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  IPlaneGeometryComponent,
  ISubModelRefComponent,
  KnownComponentType,
} from '../../interfaces';
import { ISceneComponentInternal, ISceneNodeInternal } from '../../store/internalInterfaces';
import { componentTypeToId } from '../../common/entityModelConstants';

import { updateNodeEntityComponent } from './nodeComponent';
import { updateTagEntityComponent } from './tagComponent';
import { updateOverlayEntityComponent } from './overlayComponent';
import { updateModelRefEntityComponent } from './modelRefComponent';
import { updateCameraEntityComponent } from './cameraComponent';
import { updateMotionIndicatorEntityComponent } from './motionIndicatorComponent';
import { updateModelShaderEntityComponent } from './modelShaderComponent';
import { updateLightEntityComponent } from './lightComponent';
import { updateSubModelRefEntityComponent } from './subModelRefComponent';
import { updatePlaneGeometryEntityComponent } from './planeGeometryComponent';

export const updateEntity = async (
  node: ISceneNodeInternal,
  compsToBeUpdated?: ISceneComponentInternal[],
  updateType?: ComponentUpdateType,
): Promise<void> => {
  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  const nodecomp = updateNodeEntityComponent(node, undefined);

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
            comp = updateModelRefEntityComponent(compToBeUpdated as IModelRefComponent);
            break;
          case KnownComponentType.Camera:
            comp = updateCameraEntityComponent(compToBeUpdated as ICameraComponent);
            break;
          case KnownComponentType.MotionIndicator:
            comp = updateMotionIndicatorEntityComponent(compToBeUpdated as IMotionIndicatorComponent);
            break;
          case KnownComponentType.ModelShader:
            comp = updateModelShaderEntityComponent(compToBeUpdated as IColorOverlayComponent);
            break;
          case KnownComponentType.Light:
            comp = updateLightEntityComponent(compToBeUpdated as ILightComponent);
            break;
          case KnownComponentType.SubModelRef:
            comp = updateSubModelRefEntityComponent(compToBeUpdated as ISubModelRefComponent);
            break;
          case KnownComponentType.PlaneGeometry:
            comp = updatePlaneGeometryEntityComponent(compToBeUpdated as IPlaneGeometryComponent);
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
