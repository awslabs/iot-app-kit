import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import { defaultNode } from '../../../__mocks__/sceneNode';
import { KnownComponentType } from '../../interfaces';

import { createNodeEntityComponent } from './nodeComponent';
import { createTagEntityComponent } from './tagComponent';
import { createOverlayEntityComponent } from './overlayComponent';
import { createCameraEntityComponent } from './cameraComponent';
import { createMotionIndicatorEntityComponent } from './motionIndicatorComponent';
import { createModelRefEntityComponent } from './modelRefComponent';
import { createNodeEntity } from './createNodeEntity';
import { createModelShaderEntityComponent } from './modelShaderComponent';
import { createLightEntityComponent } from './lightComponent';
import { createSubModelRefEntityComponent } from './subModelRefComponent';

jest.mock('./nodeComponent', () => ({
  createNodeEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.node' }),
}));
jest.mock('./tagComponent', () => ({
  createTagEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.tag' }),
}));
jest.mock('./overlayComponent', () => ({
  createOverlayEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.overlay' }),
}));
jest.mock('./cameraComponent', () => ({
  createCameraEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.camera' }),
}));
jest.mock('./motionIndicatorComponent', () => ({
  createMotionIndicatorEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.motionIndicator' }),
}));
jest.mock('./modelRefComponent', () => ({
  createModelRefEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.modelRef' }),
}));
jest.mock('./modelShaderComponent', () => ({
  createModelShaderEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.modelShader' }),
}));
jest.mock('./lightComponent', () => ({
  createLightEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.light' }),
}));
jest.mock('./subModelRefComponent', () => ({
  createSubModelRefEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.subModelRef' }),
}));

describe('createNodeEntity', () => {
  const createSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    createSceneEntity,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
  });

  it('should call create entity with only node component', async () => {
    await createNodeEntity(defaultNode, 'parent', 'layer');

    expect(createSceneEntity).toBeCalledTimes(1);
    expect(createSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      parentEntityId: 'parent',
      components: {
        Node: { componentTypeId: '3d.node' },
      },
    });

    expect(createNodeEntityComponent).toBeCalledTimes(1);
    expect(createNodeEntityComponent).toBeCalledWith(defaultNode, 'layer');
  });

  it('should call create entity to create multiple components', async () => {
    const tag = { type: KnownComponentType.Tag, ref: 'tag-ref' };
    const overlay = { type: KnownComponentType.DataOverlay, ref: 'overlay-ref' };
    const camera = { type: KnownComponentType.Camera, ref: 'camera-ref' };
    const motionIndicator = { type: KnownComponentType.MotionIndicator, ref: 'indicator-ref' };
    const modelRef = { type: KnownComponentType.ModelRef, ref: 'modelref-ref' };
    const modelShader = { type: KnownComponentType.ModelShader, ref: 'modelShader-ref' };
    const light = { type: KnownComponentType.Light, ref: 'light-ref' };
    const subModelRef = { type: KnownComponentType.SubModelRef, ref: 'subModelref-ref' };

    const node = {
      ...defaultNode,
      components: [tag, overlay, camera, motionIndicator, modelRef, modelShader, light, subModelRef],
    };

    await createNodeEntity(node, 'parent', 'layer');

    expect(createSceneEntity).toBeCalledTimes(1);
    expect(createSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      parentEntityId: 'parent',
      components: {
        Node: { componentTypeId: '3d.node' },
        Tag: { componentTypeId: '3d.tag' },
        DataOverlay: { componentTypeId: '3d.overlay' },
        Camera: { componentTypeId: '3d.camera' },
        MotionIndicator: { componentTypeId: '3d.motionIndicator' },
        ModelRef: { componentTypeId: '3d.modelRef' },
        ModelShader: { componentTypeId: '3d.modelShader' },
        Light: { componentTypeId: '3d.light' },
        SubModelRef: { componentTypeId: '3d.subModelRef' },
      },
    });

    expect(createNodeEntityComponent).toBeCalledTimes(1);
    expect(createNodeEntityComponent).toBeCalledWith(node, 'layer');
    expect(createTagEntityComponent).toBeCalledTimes(1);
    expect(createTagEntityComponent).toBeCalledWith(tag);
    expect(createOverlayEntityComponent).toBeCalledTimes(1);
    expect(createOverlayEntityComponent).toBeCalledWith(overlay);
    expect(createCameraEntityComponent).toBeCalledTimes(1);
    expect(createCameraEntityComponent).toBeCalledWith(camera);
    expect(createMotionIndicatorEntityComponent).toBeCalledTimes(1);
    expect(createMotionIndicatorEntityComponent).toBeCalledWith(motionIndicator);
    expect(createModelRefEntityComponent).toBeCalledTimes(1);
    expect(createModelRefEntityComponent).toBeCalledWith(modelRef);
    expect(createModelShaderEntityComponent).toBeCalledTimes(1);
    expect(createModelShaderEntityComponent).toBeCalledWith(modelShader);
    expect(createLightEntityComponent).toBeCalledTimes(1);
    expect(createLightEntityComponent).toBeCalledWith(light);
    expect(createSubModelRefEntityComponent).toBeCalledTimes(1);
    expect(createSubModelRefEntityComponent).toBeCalledWith(subModelRef);
  });
});
