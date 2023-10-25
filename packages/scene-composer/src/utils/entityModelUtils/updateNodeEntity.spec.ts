import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import { defaultNode } from '../../../__mocks__/sceneNode';
import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';

import { updateEntity } from './updateNodeEntity';
import { updateNodeEntityComponent } from './nodeComponent';
import { updateTagEntityComponent } from './tagComponent';
import { updateOverlayEntityComponent } from './overlayComponent';
import { updateCameraEntityComponent } from './cameraComponent';
import { updateMotionIndicatorEntityComponent } from './motionIndicatorComponent';
import { updateModelRefEntityComponent } from './modelRefComponent';
import { updateModelShaderEntityComponent } from './modelShaderComponent';
import { updateLightEntityComponent } from './lightComponent';
import { updateSubModelRefEntityComponent } from './subModelRefComponent';

jest.mock('./nodeComponent', () => ({
  updateNodeEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.node' }),
}));
jest.mock('./tagComponent', () => ({
  updateTagEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.tag' }),
}));
jest.mock('./overlayComponent', () => ({
  updateOverlayEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.overlay' }),
}));
jest.mock('./cameraComponent', () => ({
  updateCameraEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.camera' }),
}));
jest.mock('./motionIndicatorComponent', () => ({
  updateMotionIndicatorEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.motionIndicator' }),
}));
jest.mock('./modelRefComponent', () => ({
  updateModelRefEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.modelRef' }),
}));
jest.mock('./modelShaderComponent', () => ({
  updateModelShaderEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.modelShader' }),
}));
jest.mock('./lightComponent', () => ({
  updateLightEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.light' }),
}));
jest.mock('./subModelRefComponent', () => ({
  updateSubModelRefEntityComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.subModelRef' }),
}));

describe('updateEntity', () => {
  const updateSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    updateSceneEntity,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
  });

  it('should call update entity with only node component', async () => {
    await updateEntity(defaultNode);

    expect(updateSceneEntity).toBeCalledTimes(1);
    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
      },
    });

    expect(updateNodeEntityComponent).toBeCalledTimes(1);
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, undefined);
    expect(updateTagEntityComponent).not.toBeCalled();
    expect(updateOverlayEntityComponent).not.toBeCalled();
  });

  it('should call update entity to update multiple components', async () => {
    const tag = { type: KnownComponentType.Tag, ref: 'tag-ref' };
    const overlay = { type: KnownComponentType.DataOverlay, ref: 'overlay-ref' };
    const camera = { type: KnownComponentType.Camera, ref: 'camera-ref' };
    const motionIndicator = { type: KnownComponentType.MotionIndicator, ref: 'indicator-ref' };
    const modelRef = { type: KnownComponentType.ModelRef, ref: 'modelref-ref' };
    const modelShader = { type: KnownComponentType.ModelShader, ref: 'modelshader-ref' };
    const light = { type: KnownComponentType.Light, ref: 'light-ref' };
    const subModelRef = { type: KnownComponentType.SubModelRef, ref: 'subModelref-ref' };

    await updateEntity(
      defaultNode,
      [tag, overlay, camera, motionIndicator, modelRef, modelShader, light, subModelRef],
      'UPDATE',
    );

    expect(updateSceneEntity).toBeCalledTimes(1);
    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
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

    expect(updateNodeEntityComponent).toBeCalledTimes(1);
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateTagEntityComponent).toBeCalledTimes(1);
    expect(updateTagEntityComponent).toBeCalledWith(tag);
    expect(updateOverlayEntityComponent).toBeCalledTimes(1);
    expect(updateOverlayEntityComponent).toBeCalledWith(overlay);
    expect(updateCameraEntityComponent).toBeCalledTimes(1);
    expect(updateCameraEntityComponent).toBeCalledWith(camera);
    expect(updateMotionIndicatorEntityComponent).toBeCalledTimes(1);
    expect(updateMotionIndicatorEntityComponent).toBeCalledWith(motionIndicator);
    expect(updateModelRefEntityComponent).toBeCalledTimes(1);
    expect(updateModelRefEntityComponent).toBeCalledWith(modelRef);
    expect(updateModelShaderEntityComponent).toBeCalledTimes(1);
    expect(updateModelShaderEntityComponent).toBeCalledWith(modelShader);
    expect(updateLightEntityComponent).toBeCalledTimes(1);
    expect(updateLightEntityComponent).toBeCalledWith(light);
    expect(updateSubModelRefEntityComponent).toBeCalledTimes(1);
    expect(updateSubModelRefEntityComponent).toBeCalledWith(subModelRef);
  });

  it('should call update entity to update tag component', async () => {
    const compToUpdate = { type: KnownComponentType.Tag, ref: 'tag-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'UPDATE');

    expect(updateSceneEntity).toBeCalledTimes(1);
    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
        Tag: { componentTypeId: '3d.tag' },
      },
    });

    expect(updateNodeEntityComponent).toBeCalledTimes(1);
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateTagEntityComponent).toBeCalledTimes(1);
    expect(updateTagEntityComponent).toBeCalledWith(compToUpdate);
    expect(updateOverlayEntityComponent).not.toBeCalled();
  });

  it('should call update entity to update overlay component', async () => {
    const compToUpdate = { type: KnownComponentType.DataOverlay, ref: 'overlay-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'UPDATE');

    expect(updateSceneEntity).toBeCalledTimes(1);
    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
        DataOverlay: { componentTypeId: '3d.overlay' },
      },
    });

    expect(updateNodeEntityComponent).toBeCalledTimes(1);
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateOverlayEntityComponent).toBeCalledTimes(1);
    expect(updateOverlayEntityComponent).toBeCalledWith(compToUpdate);
    expect(updateTagEntityComponent).not.toBeCalled();
  });

  it('should call update entity without entity binding component', async () => {
    const compToUpdate = { type: KnownComponentType.EntityBinding, ref: 'entity-binding-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'UPDATE');

    expect(updateSceneEntity).toBeCalledTimes(1);
    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
      },
    });

    expect(updateNodeEntityComponent).toBeCalledTimes(1);
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateOverlayEntityComponent).not.toBeCalled();
    expect(updateTagEntityComponent).not.toBeCalled();
  });

  it('should call update entity to delete tag component', async () => {
    const compToUpdate = { type: KnownComponentType.Tag, ref: 'tag-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'DELETE');

    expect(updateSceneEntity).toBeCalledTimes(1);
    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
        Tag: { componentTypeId: componentTypeToId.Tag, updateType: 'DELETE' },
      },
    });

    expect(updateNodeEntityComponent).toBeCalledTimes(1);
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, 'DELETE');
    expect(updateOverlayEntityComponent).not.toBeCalled();
    expect(updateTagEntityComponent).not.toBeCalled();
  });
});
