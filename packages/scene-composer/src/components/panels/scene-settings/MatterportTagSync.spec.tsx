import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { MpSdk } from '@matterport/r3f/dist';

import { ISceneNodeInternal, useStore } from '../../../store';
import { MattertagItem, TagItem } from '../../../utils/matterportTagUtils';
import useDynamicScene from '../../../hooks/useDynamicScene';
import { KnownSceneProperty } from '../../../interfaces';
import { createLayer } from '../../../utils/entityModelUtils/sceneLayerUtils';
import { LayerType, MATTERPORT_TAG_LAYER_PREFIX } from '../../../common/entityModelConstants';
import { createSceneRootEntity } from '../../../utils/entityModelUtils/sceneUtils';

import { MatterportTagSync } from './MatterportTagSync';

const getMatterTagsMock = jest.fn();
const getTagsMock = jest.fn();
jest.mock('../../../hooks/useMatterportObserver', () => {
  return jest.fn(() => ({
    mattertagObserver: {
      getMattertags: getMatterTagsMock,
    },
    tagObserver: {
      getTags: getTagsMock,
    },
  }));
});

const handleAddMatterportTagMock = jest.fn().mockResolvedValue(undefined);
const handleUpdateMatterportTagMock = jest.fn().mockResolvedValue(undefined);
const handleRemoveMatterportTagMock = jest.fn().mockResolvedValue(undefined);
jest.mock('../../../hooks/useMatterportTags', () => {
  return jest.fn(() => ({
    handleAddMatterportTag: handleAddMatterportTagMock,
    handleUpdateMatterportTag: handleUpdateMatterportTagMock,
    handleRemoveMatterportTag: handleRemoveMatterportTagMock,
  }));
});

jest.mock('../../../hooks/useDynamicScene', () => jest.fn());
jest.mock('../../../utils/entityModelUtils/sceneLayerUtils', () => ({
  createLayer: jest.fn(),
}));
jest.mock('../../../utils/entityModelUtils/sceneUtils', () => ({
  createSceneRootEntity: jest.fn(),
}));

describe('MatterportTagSync', () => {
  const getComponentRefByTypeMock = jest.fn();
  const getSceneNodeByRefMock = jest.fn();
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();

  const baseState = {
    getComponentRefByType: getComponentRefByTypeMock,
    getSceneNodeByRef: getSceneNodeByRefMock,
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
  };

  const testInternalNode: ISceneNodeInternal = {
    ref: '',
    name: 'name1',
    transform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    },
    transformConstraint: {},
    components: [],
    childRefs: [],
    properties: {
      matterportId: 'id1',
    },
  };

  const testMattertagItem: MattertagItem = {
    sid: '',
    enabled: true,
    anchorPosition: { x: 0, y: 0, z: 0 },
    stemVector: { x: 0, y: 0, z: 0 },
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
  const testTagItem: TagItem = {
    id: '',
    anchorPosition: { x: 0, y: 0, z: 0 },
    discPosition: { x: 0, y: 0, z: 0 },
    stemVector: { x: 0, y: 0, z: 0 },
    stemHeight: 1,
    stemVisible: true,
    label: 'initialLabel',
    description: 'initial test tag',
    color: { r: 0, g: 0, b: 0 },
    roomId: '',
    attachments: [],
    keywords: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    useStore('default').setState(baseState);
    const { container } = render(<MatterportTagSync />);

    expect(container).toMatchSnapshot();
  });

  it('should sync mattertags by deleting id1, updating id2, and adding id3', async () => {
    useStore('default').setState(baseState);

    getComponentRefByTypeMock.mockImplementation(() => {
      const deletableTag: Record<string, string[]> = {
        ref1: [],
        ref2: [],
        'ref3:': [],
      };
      return deletableTag;
    });

    const node1: ISceneNodeInternal = { ...testInternalNode };
    const node2: ISceneNodeInternal = {
      ...testInternalNode,
      properties: {
        matterportId: 'id2',
      },
    };
    const node3: ISceneNodeInternal = {
      ...testInternalNode,
      properties: {},
    };

    getSceneNodeByRefMock.mockImplementation((ref: string) => {
      const nodeLookup = {
        ref1: node1,
        ref2: node2,
        ref3: node3,
      };
      return nodeLookup[ref];
    });

    const matterTag2 = { ...testMattertagItem, sid: 'id2' };
    const matterTag3 = { ...testMattertagItem, sid: 'id2' };
    getMatterTagsMock.mockImplementation(() => {
      const mattertags: Array<[string, MpSdk.Mattertag.ObservableMattertagData]> = [
        ['id2', matterTag2],
        ['id3', matterTag3],
      ];
      return mattertags;
    });
    getTagsMock.mockImplementation(() => undefined);
    const rendered = render(<MatterportTagSync />);

    await act(async () => {
      fireEvent.click(rendered.getByTestId('matterport-tag-sync-button'));
    });

    expect(getComponentRefByTypeMock).toBeCalled();
    expect(handleAddMatterportTagMock).toBeCalledWith(undefined, undefined, 'id3', matterTag3);
    expect(handleUpdateMatterportTagMock).toBeCalledWith(undefined, 'ref2', node2, matterTag2);
    expect(handleRemoveMatterportTagMock).toBeCalledWith('ref1');
  });

  it('should sync matterport tags by deleting id1, updating id2, and adding id3', async () => {
    useStore('default').setState(baseState);

    getComponentRefByTypeMock.mockImplementation(() => {
      const deletableTag: Record<string, string[]> = {
        ref1: [],
        ref2: [],
      };
      return deletableTag;
    });

    const node1: ISceneNodeInternal = { ...testInternalNode };
    const node2: ISceneNodeInternal = {
      ...testInternalNode,
      properties: {
        matterportId: 'id2',
      },
    };

    getSceneNodeByRefMock.mockImplementation((ref: string) => {
      const nodeLookup = {
        ref1: node1,
        ref2: node2,
      };
      return nodeLookup[ref];
    });

    const tag2 = { ...testTagItem, sid: 'id2' };
    const tag3 = { ...testTagItem, sid: 'id2' };
    getMatterTagsMock.mockImplementation(() => undefined);
    getTagsMock.mockImplementation(() => {
      const tags: Array<[string, MpSdk.Tag.TagData]> = [
        ['id2', tag2],
        ['id3', tag3],
      ];
      return tags;
    });
    const rendered = render(<MatterportTagSync />);

    await act(async () => {
      fireEvent.click(rendered.getByTestId('matterport-tag-sync-button'));
    });

    expect(getComponentRefByTypeMock).toBeCalled();
    expect(handleAddMatterportTagMock).toBeCalledWith(undefined, undefined, 'id3', tag2);
    expect(handleUpdateMatterportTagMock).toBeCalledWith(undefined, 'ref2', node2, tag3);
    expect(handleRemoveMatterportTagMock).toBeCalledWith('ref1');
  });

  describe('when dynamic scene is enabled', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (useDynamicScene as jest.Mock).mockReturnValue(true);
      (createLayer as jest.Mock).mockImplementation((name, _) => {
        return Promise.resolve({ entityId: name });
      });
      (createSceneRootEntity as jest.Mock).mockImplementation(() => {
        return Promise.resolve({ entityId: 'scene-root-id' });
      });

      getScenePropertyMock.mockImplementation((p) => {
        if (p == KnownSceneProperty.MatterportModelId) {
          return 'matterportModelId';
        } else if (p == KnownSceneProperty.LayerIds) {
          return ['layer-id'];
        } else if (p == KnownSceneProperty.SceneRootEntityId) {
          return 'scene-root-id';
        } else {
          return undefined;
        }
      });
    });

    it('should create a default layer and root entity when none available', async () => {
      getScenePropertyMock.mockImplementation((p) => {
        if (p == KnownSceneProperty.MatterportModelId) {
          return 'matterportModelId';
        } else {
          return undefined;
        }
      });
      useStore('default').setState(baseState);
      const rendered = render(<MatterportTagSync />);

      await act(async () => {
        fireEvent.click(rendered.getByTestId('matterport-tag-sync-button'));
      });

      expect(createLayer as jest.Mock).toBeCalledTimes(1);
      expect(createLayer as jest.Mock).toBeCalledWith(
        MATTERPORT_TAG_LAYER_PREFIX + 'matterportModelId',
        LayerType.Relationship,
      );
      expect(createSceneRootEntity as jest.Mock).toBeCalledTimes(1);
      expect(setScenePropertyMock).toBeCalledTimes(2);
      expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.LayerIds, [
        MATTERPORT_TAG_LAYER_PREFIX + 'matterportModelId',
      ]);
      expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneRootEntityId, 'scene-root-id');
    });

    it('should not create the default layer and root entity when available', async () => {
      useStore('default').setState(baseState);
      const rendered = render(<MatterportTagSync />);

      await act(async () => {
        fireEvent.click(rendered.getByTestId('matterport-tag-sync-button'));
      });

      expect(createLayer as jest.Mock).not.toBeCalled();
      expect(createSceneRootEntity as jest.Mock).not.toBeCalled();
      expect(setScenePropertyMock).not.toBeCalled();
    });

    it('should sync mattertags by deleting id1, updating id2, and adding id3', async () => {
      useStore('default').setState(baseState);

      getComponentRefByTypeMock.mockImplementation(() => {
        const deletableTag: Record<string, string[]> = {
          ref1: [],
          ref2: [],
          'ref3:': [],
        };
        return deletableTag;
      });

      const node1: ISceneNodeInternal = { ...testInternalNode };
      const node2: ISceneNodeInternal = {
        ...testInternalNode,
        properties: {
          matterportId: 'id2',
        },
      };
      const node3: ISceneNodeInternal = {
        ...testInternalNode,
        properties: {},
      };

      getSceneNodeByRefMock.mockImplementation((ref: string) => {
        const nodeLookup = {
          ref1: node1,
          ref2: node2,
          ref3: node3,
        };
        return nodeLookup[ref];
      });

      const matterTag2 = { ...testMattertagItem, sid: 'id2' };
      const matterTag3 = { ...testMattertagItem, sid: 'id2' };
      getMatterTagsMock.mockImplementation(() => {
        const mattertags: Array<[string, MpSdk.Mattertag.ObservableMattertagData]> = [
          ['id2', matterTag2],
          ['id3', matterTag3],
        ];
        return mattertags;
      });
      getTagsMock.mockImplementation(() => undefined);
      const rendered = render(<MatterportTagSync />);

      await act(async () => {
        fireEvent.click(rendered.getByTestId('matterport-tag-sync-button'));
      });

      expect(getComponentRefByTypeMock).toBeCalled();
      expect(handleAddMatterportTagMock).toBeCalledWith('layer-id', 'scene-root-id', 'id3', matterTag3);
      expect(handleUpdateMatterportTagMock).toBeCalledWith('layer-id', 'ref2', node2, matterTag2);
      expect(handleRemoveMatterportTagMock).toBeCalledWith('ref1');
    });

    it('should sync matterport tags by deleting id1, updating id2, and adding id3', async () => {
      useStore('default').setState(baseState);

      getComponentRefByTypeMock.mockImplementation(() => {
        const deletableTag: Record<string, string[]> = {
          ref1: [],
          ref2: [],
        };
        return deletableTag;
      });

      const node1: ISceneNodeInternal = { ...testInternalNode };
      const node2: ISceneNodeInternal = {
        ...testInternalNode,
        properties: {
          matterportId: 'id2',
        },
      };

      getSceneNodeByRefMock.mockImplementation((ref: string) => {
        const nodeLookup = {
          ref1: node1,
          ref2: node2,
        };
        return nodeLookup[ref];
      });

      const tag2 = { ...testTagItem, sid: 'id2' };
      const tag3 = { ...testTagItem, sid: 'id2' };
      getMatterTagsMock.mockImplementation(() => undefined);
      getTagsMock.mockImplementation(() => {
        const tags: Array<[string, MpSdk.Tag.TagData]> = [
          ['id2', tag2],
          ['id3', tag3],
        ];
        return tags;
      });
      const rendered = render(<MatterportTagSync />);

      await act(async () => {
        fireEvent.click(rendered.getByTestId('matterport-tag-sync-button'));
      });

      expect(getComponentRefByTypeMock).toBeCalled();
      expect(handleAddMatterportTagMock).toBeCalledWith('layer-id', 'scene-root-id', 'id3', tag2);
      expect(handleUpdateMatterportTagMock).toBeCalledWith('layer-id', 'ref2', node2, tag3);
      expect(handleRemoveMatterportTagMock).toBeCalledWith('ref1');
    });
  });
});
