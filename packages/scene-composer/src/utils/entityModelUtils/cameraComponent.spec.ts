import { PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';

import { DEFAULT_CAMERA_OPTIONS } from '../../common/constants';
import { componentTypeToId } from '../../common/entityModelConstants';
import { type ICameraComponent, KnownComponentType } from '../../interfaces';
import { CameraType } from '../../models/SceneModels';

import { createCameraEntityComponent, parseCameraComp, updateCameraEntityComponent } from './cameraComponent';

const camera: ICameraComponent = {
  type: KnownComponentType.Camera,
  ...DEFAULT_CAMERA_OPTIONS,
  cameraType: CameraType.Orthographic,
  zoom: 1,
};

describe('createCameraEntityComponent', () => {
  it('should return expected camera component', () => {
    expect(createCameraEntityComponent(camera)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Camera],
      properties: {
        cameraType: {
          value: {
            stringValue: CameraType.Orthographic,
          },
        },
        fov: {
          value: {
            doubleValue: DEFAULT_CAMERA_OPTIONS.fov,
          },
        },
        near: {
          value: {
            doubleValue: DEFAULT_CAMERA_OPTIONS.near,
          },
        },
        far: {
          value: {
            doubleValue: DEFAULT_CAMERA_OPTIONS.far,
          },
        },
        zoom: {
          value: {
            doubleValue: 1,
          },
        },
      },
    });
  });
});

describe('updateCameraEntityComponent', () => {
  it('should return expected camera component', () => {
    expect(updateCameraEntityComponent(camera)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Camera],
      propertyUpdates: expect.objectContaining({
        cameraType: {
          value: {
            stringValue: CameraType.Orthographic,
          },
        },
      }),
    });
  });

  it('should reset properties that are no longer present', () => {
    expect(
      updateCameraEntityComponent(
        {
          type: KnownComponentType.Camera,
          cameraType: camera.cameraType,
          near: camera.near,
          far: camera.far,
          zoom: camera.zoom,
        },
        camera,
      ),
    ).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Camera],
      propertyUpdates: {
        cameraType: {
          value: {
            stringValue: CameraType.Orthographic,
          },
        },
        fov: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        near: {
          value: {
            doubleValue: DEFAULT_CAMERA_OPTIONS.near,
          },
        },
        far: {
          value: {
            doubleValue: DEFAULT_CAMERA_OPTIONS.far,
          },
        },
        zoom: {
          value: {
            doubleValue: 1,
          },
        },
      },
    });
  });
});

describe('parseCameraComp', () => {
  it('should parse to expected camera component', () => {
    expect(
      parseCameraComp({
        properties: [
          {
            propertyName: 'cameraType',
            propertyValue: 'Orthographic',
          },
          {
            propertyName: 'fov',
            propertyValue: 90,
          },
          {
            propertyName: 'far',
            propertyValue: 222,
          },
          {
            propertyName: 'near',
            propertyValue: 0.5,
          },
          {
            propertyName: 'zoom',
            propertyValue: 2,
          },
        ],
      }),
    ).toEqual({
      ref: expect.any(String),
      type: KnownComponentType.Camera,
      cameraType: 'Orthographic',
      fov: 90,
      far: 222,
      near: 0.5,
      zoom: 2,
    });
  });

  it('should parse to expected camera component with default values', () => {
    expect(
      parseCameraComp({
        properties: [],
      }),
    ).toEqual({
      ...camera,
      ref: expect.any(String),
      cameraType: CameraType.Perspective,
    });
  });
});
