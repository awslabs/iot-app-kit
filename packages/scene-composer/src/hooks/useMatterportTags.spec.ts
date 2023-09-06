import { renderHook } from '@testing-library/react-hooks';
import { MpSdk } from '@matterport/r3f/dist';
import flushPromises from 'flush-promises';
import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { generateUUID } from '../utils/mathUtils';
import { IAnchorComponent, ISceneNode, KnownComponentType } from '../interfaces';
import { IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../store';
import { MattertagItem, TagItem } from '../utils/matterportTagUtils';
import { Component } from '../models/SceneModels';
import { setTwinMakerSceneMetadataModule } from '../common/GlobalSettings';

import useMatterportTags from './useMatterportTags';
import useDynamicScene from './useDynamicScene';

jest.mock('../utils/mathUtils', () => ({
  generateUUID: jest.fn(() => 'random-uuid'),
}));
jest.mock('./useDynamicScene', () => jest.fn());

describe('useMatterportTags', () => {
  const appendSceneNode = jest.fn();
  const updateSceneNodeInternal = jest.fn();
  const removeSceneNode = jest.fn();

  const id = 'testMatterportId';

  const mattertagItem: MattertagItem = {
    sid: id,
    enabled: true,
    anchorPosition: { x: 1, y: 2, z: 3 },
    stemVector: { x: 4, y: 5, z: 6 },
    stemVisible: true,
    label: 'initialLabel',
    description: 'initial test tag',
    media: {
      type: 'mattertag.media.none' as MpSdk.Mattertag.MediaType,
      src: '',
    },
    color: { r: 1, g: 1, b: 0 },
    floorIndex: 0,
    floorInfo: {
      id: 'testFloorid',
      sequence: 0,
    },
  };

  const tagItem: TagItem = {
    id: id,
    anchorPosition: { x: 1, y: 2, z: 3 },
    discPosition: { x: 7, y: 8, z: 9 },
    stemVector: { x: 4, y: 5, z: 6 },
    stemHeight: 1,
    stemVisible: true,
    label: 'initialLabel',
    description: 'initial test tag',
    color: { r: 1, g: 1, b: 0 },
    roomId: '',
    attachments: [],
    keywords: [],
  };

  const anchorComponent: IAnchorComponent = {
    type: 'Tag',
    offset: [mattertagItem.stemVector.x, mattertagItem.stemVector.y, mattertagItem.stemVector.z],
    chosenColor: '#ffff00',
    icon: 'iottwinmaker.common.icon:Custom',
  };

  const dataOverlayComponent: IDataOverlayComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.DataOverlay,
    subType: Component.DataOverlaySubType.OverlayPanel,
    valueDataBindings: [],
    dataRows: [
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: `#### **${mattertagItem.label}**  
${mattertagItem.description}`,
      },
    ],
  };

  const testNode = {
    ref: generateUUID(),
    name: mattertagItem.label,
    components: [anchorComponent, dataOverlayComponent],
    transform: {
      position: [mattertagItem.anchorPosition.x, mattertagItem.anchorPosition.y, mattertagItem.anchorPosition.z],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    properties: {
      matterportId: id, //mattertag uses item.sid and tag uses item.id so we just us the collection key for both
    },
    //parentRef: getRefForParenting(),
  } as ISceneNode;

  const testInternalNode: ISceneNodeInternal = {
    ...testNode,
    ref: generateUUID(),
    name: testNode.name!,
    transform: testNode.transform!,
    transformConstraint: {},
    components: [{ ...anchorComponent, ref: '' }],
    childRefs: [],
    properties: testNode.properties!,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useStore('default').setState({
      appendSceneNode,
      updateSceneNodeInternal,
      removeSceneNode,
    });
    jest.clearAllMocks();
  });

  it('should add matterport mattertag', () => {
    const { handleAddMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleAddMatterportTag('', '', id, mattertagItem);
    expect(appendSceneNode).toBeCalledWith(testNode);
  });

  it('should add matterport tag', () => {
    const { handleAddMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleAddMatterportTag('', '', id, tagItem);
    expect(appendSceneNode).toBeCalledWith(testNode);
  });

  it('should update matterport mattertag', () => {
    const { handleUpdateMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleUpdateMatterportTag('', '', testInternalNode, mattertagItem);
    expect(updateSceneNodeInternal).toBeCalledWith('', {
      name: mattertagItem.label,
      transform: {
        position: [mattertagItem.anchorPosition.x, mattertagItem.anchorPosition.y, mattertagItem.anchorPosition.z],
      },
      components: [
        {
          ...anchorComponent,
          ref: '',
          offset: [mattertagItem.stemVector.x, mattertagItem.stemVector.y, mattertagItem.stemVector.z],
        },
        {
          ...dataOverlayComponent,
          dataRows: [
            {
              rowType: Component.DataOverlayRowType.Markdown,
              content: `#### **${mattertagItem.label}**  
${mattertagItem.description}`,
            },
          ],
        },
      ],
    });
  });

  it('should update matterport tag', () => {
    const { handleUpdateMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleUpdateMatterportTag('', '', testInternalNode, tagItem);
    expect(updateSceneNodeInternal).toBeCalledWith('', {
      name: tagItem.label,
      transform: {
        position: [tagItem.anchorPosition.x, tagItem.anchorPosition.y, tagItem.anchorPosition.z],
      },
      components: [
        {
          ...anchorComponent,
          ref: '',
          offset: [tagItem.stemVector.x, tagItem.stemVector.y, tagItem.stemVector.z],
        },
        {
          ...dataOverlayComponent,
          dataRows: [
            {
              rowType: Component.DataOverlayRowType.Markdown,
              content: `#### **${mattertagItem.label}**  
${mattertagItem.description}`,
            },
          ],
        },
      ],
    });
  });

  it('should delete matterport mattertag or tag', () => {
    const { handleRemoveMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleRemoveMatterportTag('deleteMe');
    expect(removeSceneNode).toBeCalledWith('deleteMe');
  });

  describe('when dynamic scene is enabled', () => {
    const createSceneEntity = jest.fn().mockResolvedValue({ entityId: generateUUID() });
    const updateSceneEntity = jest.fn().mockResolvedValue({ entityId: generateUUID() });
    const deleteSceneEntity = jest.fn().mockResolvedValue({ entityId: generateUUID() });
    const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
      createSceneEntity,
      updateSceneEntity,
      deleteSceneEntity,
    };

    beforeEach(() => {
      jest.clearAllMocks();

      useStore('default').setState({
        appendSceneNode,
        updateSceneNodeInternal,
        removeSceneNode,
      });

      (useDynamicScene as jest.Mock).mockReturnValue(true);
      setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
    });

    it('should add matterport mattertag', async () => {
      const { handleAddMatterportTag } = renderHook(() => useMatterportTags()).result.current;

      await handleAddMatterportTag('layer-id', 'scene-root-id', id, mattertagItem);
      expect(appendSceneNode).toBeCalledTimes(1);
      expect(createSceneEntity).toBeCalledTimes(1);
      expect(createSceneEntity).toBeCalledWith({
        workspaceId: undefined,
        entityId: generateUUID(),
        entityName: mattertagItem.label + '_' + generateUUID(),
        parentEntityId: 'scene-root-id',
        components: {
          [KnownComponentType.Tag]: expect.anything(),
          [KnownComponentType.DataOverlay]: expect.anything(),
          Node: expect.anything(),
        },
      });
    });

    it('should add matterport tag', async () => {
      const { handleAddMatterportTag } = renderHook(() => useMatterportTags()).result.current;

      await handleAddMatterportTag('layer-id', 'scene-root-id', id, tagItem);
      expect(appendSceneNode).toBeCalledTimes(1);
      expect(createSceneEntity).toBeCalledTimes(1);
      expect(createSceneEntity).toBeCalledWith({
        workspaceId: undefined,
        entityId: generateUUID(),
        entityName: tagItem.label + '_' + generateUUID(),
        parentEntityId: 'scene-root-id',
        components: {
          [KnownComponentType.Tag]: expect.anything(),
          [KnownComponentType.DataOverlay]: expect.anything(),
          Node: expect.anything(),
        },
      });
    });

    it('should update matterport mattertag', async () => {
      const { handleUpdateMatterportTag } = renderHook(() => useMatterportTags()).result.current;

      await handleUpdateMatterportTag('layer-id', generateUUID(), testInternalNode, mattertagItem);
      expect(updateSceneNodeInternal).toBeCalledTimes(1);
      expect(updateSceneEntity).toBeCalledTimes(1);
      expect(updateSceneEntity).toBeCalledWith({
        workspaceId: undefined,
        entityId: generateUUID(),
        entityName: mattertagItem.label + '_' + generateUUID(),
        componentUpdates: {
          Node: expect.anything(),
          [KnownComponentType.Tag]: expect.anything(),
        },
      });
    });

    it('should update matterport tag', async () => {
      const { handleUpdateMatterportTag } = renderHook(() => useMatterportTags()).result.current;

      await handleUpdateMatterportTag('layer-id', generateUUID(), testInternalNode, tagItem);
      expect(updateSceneNodeInternal).toBeCalledTimes(1);
      expect(updateSceneEntity).toBeCalledTimes(1);
      expect(updateSceneEntity).toBeCalledWith({
        workspaceId: undefined,
        entityId: generateUUID(),
        entityName: tagItem.label + '_' + generateUUID(),
        componentUpdates: {
          Node: expect.anything(),
          [KnownComponentType.Tag]: expect.anything(),
        },
      });
    });

    it('should delete matterport mattertag or tag', async () => {
      const { handleRemoveMatterportTag } = renderHook(() => useMatterportTags()).result.current;

      handleRemoveMatterportTag('deleteMe');
      await flushPromises();

      expect(removeSceneNode).toBeCalledTimes(1);
      expect(deleteSceneEntity).toBeCalledTimes(1);
      expect(deleteSceneEntity).toBeCalledWith({ entityId: 'deleteMe' });
    });
  });
});
