import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import { defaultNode } from '../../../__mocks__/sceneNode';
import { KnownComponentType } from '../../interfaces';

import { createNodeEntityComponent } from './nodeComponent';
import { createTagEntityComponent } from './tagComponent';
import { createOverlayEntityComponent } from './overlayComponent';
import { createCameraEntityComponent } from './cameraComponent';
import { createMotionIndicatorEntityComponent } from './motionIndicatorComponent';
import { createModelRefComponent } from './modelRefComponent';
import { createNodeEntity } from './createNodeEntity';
import { createModelShaderEntityComponent } from './modelShaderComponent';

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
  createModelRefComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.modelRef' }),
}));
jest.mock('./modelShaderComponent', () => ({
  createModelShaderEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.modelShader' }),
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

    expect(createSceneEntity).toHaveBeenCalledTimes(1);
    expect(createSceneEntity).toHaveBeenCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      parentEntityId: 'parent',
      components: {
        Node: { componentTypeId: '3d.node' },
      },
    });

    expect(createNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(createNodeEntityComponent).toHaveBeenCalledWith(defaultNode, 'layer');
  });

  it('should call create entity to create multiple components', async () => {
    const tag = { type: KnownComponentType.Tag, ref: 'tag-ref' };
    const overlay = { type: KnownComponentType.DataOverlay, ref: 'overlay-ref' };
    const camera = { type: KnownComponentType.Camera, ref: 'camera-ref' };
    const motionIndicator = { type: KnownComponentType.MotionIndicator, ref: 'indicator-ref' };
    const modelRef = { type: KnownComponentType.ModelRef, ref: 'modelref-ref' };
    const modelShader = { type: KnownComponentType.ModelShader, ref: 'modelShader-ref' };
    const node = { ...defaultNode, components: [tag, overlay, camera, motionIndicator, modelRef, modelShader] };

    await createNodeEntity(node, 'parent', 'layer');

    expect(createSceneEntity).toHaveBeenCalledTimes(1);
    expect(createSceneEntity).toHaveBeenCalledWith({
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
      },
    });

    expect(createNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(createNodeEntityComponent).toHaveBeenCalledWith(node, 'layer');
    expect(createTagEntityComponent).toHaveBeenCalledTimes(1);
    expect(createTagEntityComponent).toHaveBeenCalledWith(tag);
    expect(createOverlayEntityComponent).toHaveBeenCalledTimes(1);
    expect(createOverlayEntityComponent).toHaveBeenCalledWith(overlay);
    expect(createCameraEntityComponent).toHaveBeenCalledTimes(1);
    expect(createCameraEntityComponent).toHaveBeenCalledWith(camera);
    expect(createMotionIndicatorEntityComponent).toHaveBeenCalledTimes(1);
    expect(createMotionIndicatorEntityComponent).toHaveBeenCalledWith(motionIndicator);
    expect(createModelRefComponent).toHaveBeenCalledTimes(1);
    expect(createModelRefComponent).toHaveBeenCalledWith(modelRef);
    expect(createModelShaderEntityComponent).toHaveBeenCalledTimes(1);
    expect(createModelShaderEntityComponent).toHaveBeenCalledWith(modelShader);
  });
});
