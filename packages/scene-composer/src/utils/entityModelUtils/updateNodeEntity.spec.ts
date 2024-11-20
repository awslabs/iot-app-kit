import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

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
import { updatePlaneGeometryEntityComponent } from './planeGeometryComponent';

vi.mock('./nodeComponent', () => ({
  updateNodeEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.node' }),
}));
vi.mock('./tagComponent', () => ({
  updateTagEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.tag' }),
}));
vi.mock('./overlayComponent', () => ({
  updateOverlayEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.overlay' }),
}));
vi.mock('./cameraComponent', () => ({
  updateCameraEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.camera' }),
}));
vi.mock('./motionIndicatorComponent', () => ({
  updateMotionIndicatorEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.motionIndicator' }),
}));
vi.mock('./modelRefComponent', () => ({
  updateModelRefEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.modelRef' }),
}));
vi.mock('./modelShaderComponent', () => ({
  updateModelShaderEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.modelShader' }),
}));
vi.mock('./lightComponent', () => ({
  updateLightEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.light' }),
}));
vi.mock('./subModelRefComponent', () => ({
  updateSubModelRefEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.subModelRef' }),
}));
vi.mock('./planeGeometryComponent', () => ({
  updatePlaneGeometryEntityComponent: vi.fn().mockReturnValue({ componentTypeId: '3d.planeGeometry' }),
}));

describe('updateEntity', () => {
  const updateSceneEntity = vi.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    updateSceneEntity,
  };

  beforeEach(() => {
    vi.clearAllMocks();
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
    const planeGeometry = { type: KnownComponentType.PlaneGeometry, ref: 'planegeometry-ref' };

    await updateEntity(
      defaultNode,
      [tag, overlay, camera, motionIndicator, modelRef, modelShader, light, subModelRef, planeGeometry],
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
        PlaneGeometry: { componentTypeId: '3d.planeGeometry' },
      },
    });

    expect(updateNodeEntityComponent).toBeCalledTimes(1);
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, undefined);
    expect(updateTagEntityComponent).toBeCalledTimes(1);
    expect(updateTagEntityComponent).toBeCalledWith(tag, undefined);
    expect(updateOverlayEntityComponent).toBeCalledTimes(1);
    expect(updateOverlayEntityComponent).toBeCalledWith(overlay, undefined);
    expect(updateCameraEntityComponent).toBeCalledTimes(1);
    expect(updateCameraEntityComponent).toBeCalledWith(camera, undefined);
    expect(updateMotionIndicatorEntityComponent).toBeCalledTimes(1);
    expect(updateMotionIndicatorEntityComponent).toBeCalledWith(motionIndicator, undefined);
    expect(updateModelRefEntityComponent).toBeCalledTimes(1);
    expect(updateModelRefEntityComponent).toBeCalledWith(modelRef, undefined);
    expect(updateModelShaderEntityComponent).toBeCalledTimes(1);
    expect(updateModelShaderEntityComponent).toBeCalledWith(modelShader, undefined);
    expect(updateLightEntityComponent).toBeCalledTimes(1);
    expect(updateLightEntityComponent).toBeCalledWith(light, undefined);
    expect(updateSubModelRefEntityComponent).toBeCalledTimes(1);
    expect(updateSubModelRefEntityComponent).toBeCalledWith(subModelRef, undefined);
    expect(updatePlaneGeometryEntityComponent).toBeCalledTimes(1);
    expect(updatePlaneGeometryEntityComponent).toBeCalledWith(planeGeometry, undefined);
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
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, undefined);
    expect(updateTagEntityComponent).toBeCalledTimes(1);
    expect(updateTagEntityComponent).toBeCalledWith(compToUpdate, undefined);
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
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, undefined);
    expect(updateOverlayEntityComponent).toBeCalledTimes(1);
    expect(updateOverlayEntityComponent).toBeCalledWith(compToUpdate, undefined);
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
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, undefined);
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
    expect(updateNodeEntityComponent).toBeCalledWith(defaultNode, undefined, undefined);
    expect(updateOverlayEntityComponent).not.toBeCalled();
    expect(updateTagEntityComponent).not.toBeCalled();
  });
});
