import { renderHook } from '@testing-library/react-hooks';
import { MpSdk } from '@matterport/r3f/dist';

import { IAnchorComponent, ISceneNode } from '../interfaces';
import { ISceneNodeInternal, useStore } from '../store';
import { MattertagItem, TagItem } from '../utils/matterportTagUtils';

import useMatterportTags from './useMatterportTags';

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
    color: { r: 0, g: 0, b: 0 },
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
    color: { r: 10, g: 11, b: 12 },
    roomId: '',
    attachments: [],
    keywords: [],
  };

  const anchorComponent: IAnchorComponent = {
    type: 'Tag',
    offset: [mattertagItem.stemVector.x, mattertagItem.stemVector.y, mattertagItem.stemVector.z],
  };

  const testNode = {
    name: mattertagItem.label,
    components: [anchorComponent],
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
    ref: '',
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

    handleAddMatterportTag(id, mattertagItem);
    expect(appendSceneNode).toBeCalledWith(testNode);
  });

  it('should add matterport tag', () => {
    const { handleAddMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleAddMatterportTag(id, tagItem);
    expect(appendSceneNode).toBeCalledWith(testNode);
  });

  it('should update matterport mattertag', () => {
    const { handleUpdateMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleUpdateMatterportTag('', testInternalNode, mattertagItem);
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
      ],
    });
  });

  it('should update matterport tag', () => {
    const { handleUpdateMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleUpdateMatterportTag('', testInternalNode, tagItem);
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
      ],
    });
  });

  it('should delete matterport mattertag or tag', () => {
    const { handleRemoveMatterportTag } = renderHook(() => useMatterportTags()).result.current;

    handleRemoveMatterportTag('deleteMe');
    expect(removeSceneNode).toBeCalledWith('deleteMe');
  });
});
