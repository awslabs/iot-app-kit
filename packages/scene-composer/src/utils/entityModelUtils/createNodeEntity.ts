import {
  ComponentUpdateRequest,
  CreateEntityCommandInput,
  CreateEntityCommandOutput,
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
import { ISceneNodeInternal } from '../../store/internalInterfaces';

import { createNodeEntityComponent } from './nodeComponent';
import { createTagEntityComponent } from './tagComponent';
import { createOverlayEntityComponent } from './overlayComponent';
import { createMotionIndicatorEntityComponent } from './motionIndicatorComponent';
import { createCameraEntityComponent } from './cameraComponent';
import { createModelRefEntityComponent } from './modelRefComponent';
import { createModelShaderEntityComponent } from './modelShaderComponent';
import { createLightEntityComponent } from './lightComponent';
import { createSubModelRefEntityComponent } from './subModelRefComponent';
import { createPlaneGeometryEntityComponent } from './planeGeometryComponent';

export const createNodeEntity = async (
  node: ISceneNodeInternal,
  parentRef: string,
  layerId?: string,
): Promise<CreateEntityCommandOutput | undefined> => {
  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  const nodecomp = createNodeEntityComponent(node, layerId);

  const createEntity: CreateEntityCommandInput = {
    workspaceId: undefined,
    entityId: node.ref,
    entityName: node.name + '_' + node.ref,
    parentEntityId: parentRef,
    components: {
      Node: nodecomp,
    },
  };

  node.components?.forEach((compToBeCreated) => {
    if (compToBeCreated?.type !== KnownComponentType.EntityBinding) {
      let comp: ComponentUpdateRequest | undefined = undefined;
      switch (compToBeCreated?.type) {
        case KnownComponentType.Tag:
          comp = createTagEntityComponent(compToBeCreated);
          break;
        case KnownComponentType.DataOverlay:
          comp = createOverlayEntityComponent(compToBeCreated as IDataOverlayComponent);
          break;
        case KnownComponentType.MotionIndicator:
          comp = createMotionIndicatorEntityComponent(compToBeCreated as IMotionIndicatorComponent);
          break;
        case KnownComponentType.Camera:
          comp = createCameraEntityComponent(compToBeCreated as ICameraComponent);
          break;
        case KnownComponentType.ModelRef:
          comp = createModelRefEntityComponent(compToBeCreated as IModelRefComponent);
          break;
        case KnownComponentType.ModelShader:
          comp = createModelShaderEntityComponent(compToBeCreated as IColorOverlayComponent);
          break;
        case KnownComponentType.Light:
          comp = createLightEntityComponent(compToBeCreated as ILightComponent);
          break;
        case KnownComponentType.SubModelRef:
          comp = createSubModelRefEntityComponent(compToBeCreated as ISubModelRefComponent);
          break;
        case KnownComponentType.PlaneGeometry:
          comp = createPlaneGeometryEntityComponent(compToBeCreated as IPlaneGeometryComponent);
          break;
        default:
          throw new Error(`Component type not supported: ${compToBeCreated.type}`);
      }

      if (comp) {
        createEntity.components![compToBeCreated.type] = comp;
      }
    }
  });

  return sceneMetadataModule?.createSceneEntity(createEntity);
};
