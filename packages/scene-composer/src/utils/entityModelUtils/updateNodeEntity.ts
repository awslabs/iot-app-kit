import {
  ComponentUpdateRequest,
  ComponentRequest,
  ComponentUpdateType,
  UpdateEntityCommandInput,
  PropertyUpdateType,
} from '@aws-sdk/client-iottwinmaker';

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
  oldNode?: ISceneNodeInternal,
  //oldParentRef?: string | undefined,
  sceneRootEntityId?: string | undefined,
): Promise<void> => {
  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  const nodecomp = updateNodeEntityComponent(node, oldNode, undefined);

  let updateEntity: UpdateEntityCommandInput = {
    workspaceId: undefined,
    entityId: node.ref,
    entityName: node.name + '_' + node.ref,
    componentUpdates: {
      Node: nodecomp,
    },
  };

  if (sceneRootEntityId) {
    const oldParentEntityId = oldNode?.parentRef ?? sceneRootEntityId;
    const newParentEntityId = node.parentRef ?? sceneRootEntityId;
    if (newParentEntityId !== oldParentEntityId) {
      updateEntity = {
        ...updateEntity,
        parentEntityUpdate: {
          updateType: 'UPDATE',
          parentEntityId: newParentEntityId,
        },
      };
    }
  }

  compsToBeUpdated?.forEach((compToBeUpdated) => {
    if (compToBeUpdated?.type !== KnownComponentType.EntityBinding) {
      let comp: ComponentUpdateRequest | undefined = undefined;
      if (updateType === ComponentUpdateType.DELETE) {
        comp = {
          componentTypeId: componentTypeToId[compToBeUpdated?.type],
          updateType: updateType,
        };
      } else {
        const oldComponent = oldNode?.components.find((comp) => {
          return comp.ref === compToBeUpdated.ref;
        });
        switch (compToBeUpdated?.type) {
          case KnownComponentType.Tag:
            comp = updateTagEntityComponent(compToBeUpdated, oldComponent);
            break;
          case KnownComponentType.DataOverlay:
            comp = updateOverlayEntityComponent(
              compToBeUpdated as IDataOverlayComponent,
              oldComponent as IDataOverlayComponent,
            );
            break;
          case KnownComponentType.ModelRef:
            comp = updateModelRefEntityComponent(
              compToBeUpdated as IModelRefComponent,
              oldComponent as IModelRefComponent,
            );
            break;
          case KnownComponentType.Camera:
            comp = updateCameraEntityComponent(compToBeUpdated as ICameraComponent, oldComponent as ICameraComponent);
            break;
          case KnownComponentType.MotionIndicator:
            comp = updateMotionIndicatorEntityComponent(
              compToBeUpdated as IMotionIndicatorComponent,
              oldComponent as IMotionIndicatorComponent,
            );
            break;
          case KnownComponentType.ModelShader:
            comp = updateModelShaderEntityComponent(
              compToBeUpdated as IColorOverlayComponent,
              oldComponent as IColorOverlayComponent,
            );
            break;
          case KnownComponentType.Light:
            comp = updateLightEntityComponent(compToBeUpdated as ILightComponent, oldComponent as ILightComponent);
            break;
          case KnownComponentType.SubModelRef:
            comp = updateSubModelRefEntityComponent(
              compToBeUpdated as ISubModelRefComponent,
              oldComponent as ISubModelRefComponent,
            );
            break;
          case KnownComponentType.PlaneGeometry:
            comp = updatePlaneGeometryEntityComponent(
              compToBeUpdated as IPlaneGeometryComponent,
              oldComponent as IPlaneGeometryComponent,
            );
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

// resets top level properties, doesn't handle properties with object that have sub properties
// also doesn't handle when the scene composer component property has a different name then the
// Entity component property name
// this makes it a useful first pass tool, but additional custom handling can be required for a specific
// component type
export const resetProperties = (
  newComponent: object,
  oldComponent: object,
  request: ComponentRequest,
  propValues: string[],
): void => {
  for (const property of propValues) {
    if (!(property in newComponent) && property in oldComponent) {
      request.properties![property] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
    }
  }
};
