import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';

import { ICameraComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { ICameraComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';
import { CameraType } from '../../models/SceneModels';
import { DEFAULT_CAMERA_OPTIONS } from '../../common/constants';

import { resetProperties } from './updateNodeEntity';

export enum CameraComponentProperty {
  CameraType = 'cameraType',
  Fov = 'fov',
  Near = 'near',
  Far = 'far',
  Zoom = 'zoom',
}

export const createCameraEntityComponent = (camera: ICameraComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.Camera],
    properties: {
      [CameraComponentProperty.CameraType]: {
        value: {
          stringValue: camera.cameraType,
        },
      },
    },
  };

  if (camera.fov !== undefined) {
    comp.properties![CameraComponentProperty.Fov] = {
      value: {
        doubleValue: camera.fov,
      },
    };
  }
  if (camera.near !== undefined) {
    comp.properties![CameraComponentProperty.Near] = {
      value: {
        doubleValue: camera.near,
      },
    };
  }
  if (camera.far !== undefined) {
    comp.properties![CameraComponentProperty.Far] = {
      value: {
        doubleValue: camera.far,
      },
    };
  }
  if (camera.zoom !== undefined) {
    comp.properties![CameraComponentProperty.Zoom] = {
      value: {
        doubleValue: camera.zoom,
      },
    };
  }

  return comp;
};

export const updateCameraEntityComponent = (
  camera: ICameraComponent,
  oldComponent?: ICameraComponent,
): ComponentUpdateRequest => {
  const request = createCameraEntityComponent(camera);
  if (oldComponent) {
    resetProperties(camera, oldComponent, request, Object.values(CameraComponentProperty));
  }
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseCameraComp = (comp: DocumentType): ICameraComponentInternal | undefined => {
  if (!comp?.['properties']) {
    return undefined;
  }

  const cameraComp: ICameraComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.Camera,
    cameraType:
      comp['properties'].find((p) => p['propertyName'] === CameraComponentProperty.CameraType)?.propertyValue ??
      CameraType.Perspective,
    fov:
      comp['properties'].find((p) => p['propertyName'] === CameraComponentProperty.Fov)?.propertyValue ??
      DEFAULT_CAMERA_OPTIONS.fov,
    near:
      comp['properties'].find((p) => p['propertyName'] === CameraComponentProperty.Near)?.propertyValue ??
      DEFAULT_CAMERA_OPTIONS.near,
    far:
      comp['properties'].find((p) => p['propertyName'] === CameraComponentProperty.Far)?.propertyValue ??
      DEFAULT_CAMERA_OPTIONS.far,
    zoom: comp['properties'].find((p) => p['propertyName'] === CameraComponentProperty.Zoom)?.propertyValue ?? 1,
  };

  return cameraComp;
};
