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
import { updateModelRefComponent } from './modelRefComponent';

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
  updateModelRefComponent: jest.fn().mockReturnValue({ componentTypeId: '3d.modelRef' }),
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

    expect(updateSceneEntity).toHaveBeenCalledTimes(1);
    expect(updateSceneEntity).toHaveBeenCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
      },
    });

    expect(updateNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateNodeEntityComponent).toHaveBeenCalledWith(defaultNode, undefined, undefined);
    expect(updateTagEntityComponent).not.toHaveBeenCalled();
    expect(updateOverlayEntityComponent).not.toHaveBeenCalled();
  });

  it('should call update entity to update multiple components', async () => {
    const tag = { type: KnownComponentType.Tag, ref: 'tag-ref' };
    const overlay = { type: KnownComponentType.DataOverlay, ref: 'overlay-ref' };
    const camera = { type: KnownComponentType.Camera, ref: 'camera-ref' };
    const motionIndicator = { type: KnownComponentType.MotionIndicator, ref: 'indicator-ref' };
    const modelRef = { type: KnownComponentType.ModelRef, ref: 'modelref-ref' };

    await updateEntity(defaultNode, [tag, overlay, camera, motionIndicator, modelRef], 'UPDATE');

    expect(updateSceneEntity).toHaveBeenCalledTimes(1);
    expect(updateSceneEntity).toHaveBeenCalledWith({
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
      },
    });

    expect(updateNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateNodeEntityComponent).toHaveBeenCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateTagEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateTagEntityComponent).toHaveBeenCalledWith(tag);
    expect(updateOverlayEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateOverlayEntityComponent).toHaveBeenCalledWith(overlay);
    expect(updateCameraEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateCameraEntityComponent).toHaveBeenCalledWith(camera);
    expect(updateMotionIndicatorEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateMotionIndicatorEntityComponent).toHaveBeenCalledWith(motionIndicator);
    expect(updateModelRefComponent).toHaveBeenCalledTimes(1);
    expect(updateModelRefComponent).toHaveBeenCalledWith(modelRef);
  });

  it('should call update entity to update tag component', async () => {
    const compToUpdate = { type: KnownComponentType.Tag, ref: 'tag-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'UPDATE');

    expect(updateSceneEntity).toHaveBeenCalledTimes(1);
    expect(updateSceneEntity).toHaveBeenCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
        Tag: { componentTypeId: '3d.tag' },
      },
    });

    expect(updateNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateNodeEntityComponent).toHaveBeenCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateTagEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateTagEntityComponent).toHaveBeenCalledWith(compToUpdate);
    expect(updateOverlayEntityComponent).not.toHaveBeenCalled();
  });

  it('should call update entity to update overlay component', async () => {
    const compToUpdate = { type: KnownComponentType.DataOverlay, ref: 'overlay-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'UPDATE');

    expect(updateSceneEntity).toHaveBeenCalledTimes(1);
    expect(updateSceneEntity).toHaveBeenCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
        DataOverlay: { componentTypeId: '3d.overlay' },
      },
    });

    expect(updateNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateNodeEntityComponent).toHaveBeenCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateOverlayEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateOverlayEntityComponent).toHaveBeenCalledWith(compToUpdate);
    expect(updateTagEntityComponent).not.toHaveBeenCalled();
  });

  it('should call update entity without entity binding component', async () => {
    const compToUpdate = { type: KnownComponentType.EntityBinding, ref: 'entity-binding-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'UPDATE');

    expect(updateSceneEntity).toHaveBeenCalledTimes(1);
    expect(updateSceneEntity).toHaveBeenCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
      },
    });

    expect(updateNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateNodeEntityComponent).toHaveBeenCalledWith(defaultNode, undefined, 'UPDATE');
    expect(updateOverlayEntityComponent).not.toHaveBeenCalled();
    expect(updateTagEntityComponent).not.toHaveBeenCalled();
  });

  it('should call update entity to delete tag component', async () => {
    const compToUpdate = { type: KnownComponentType.Tag, ref: 'tag-ref' };

    await updateEntity(defaultNode, [compToUpdate], 'DELETE');

    expect(updateSceneEntity).toHaveBeenCalledTimes(1);
    expect(updateSceneEntity).toHaveBeenCalledWith({
      workspaceId: undefined,
      entityId: defaultNode.ref,
      entityName: defaultNode.name + '_' + defaultNode.ref,
      componentUpdates: {
        Node: { componentTypeId: '3d.node' },
        Tag: { componentTypeId: componentTypeToId.Tag, updateType: 'DELETE' },
      },
    });

    expect(updateNodeEntityComponent).toHaveBeenCalledTimes(1);
    expect(updateNodeEntityComponent).toHaveBeenCalledWith(defaultNode, undefined, 'DELETE');
    expect(updateOverlayEntityComponent).not.toHaveBeenCalled();
    expect(updateTagEntityComponent).not.toHaveBeenCalled();
  });
});
