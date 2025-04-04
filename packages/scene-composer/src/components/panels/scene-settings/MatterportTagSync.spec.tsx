import { act, fireEvent, render } from '@/tests/testing-library';
import { type MpSdk } from '@matterport/r3f/dist';
import { type ISceneNodeInternal, accessStore } from '../../../store';
import { type MattertagItem, type TagItem } from '../../../utils/matterportTagUtils';
import { MatterportTagSync } from './MatterportTagSync';

const getMatterTagsMock = vi.fn();
const getTagsMock = vi.fn();
vi.mock('../../../hooks/useMatterportObserver', () => ({
  default: vi.fn(() => ({
    mattertagObserver: {
      getMattertags: getMatterTagsMock,
    },
    tagObserver: {
      getTags: getTagsMock,
    },
  })),
}));

const handleAddMatterportTagMock = vi.fn();
const handleUpdateMatterportTagMock = vi.fn();
const handleRemoveMatterportTagMock = vi.fn();
vi.mock('../../../hooks/useMatterportTags', () => ({
  default: vi.fn(() => ({
    handleAddMatterportTag: handleAddMatterportTagMock,
    handleUpdateMatterportTag: handleUpdateMatterportTagMock,
    handleRemoveMatterportTag: handleRemoveMatterportTagMock,
  })),
}));

describe('MatterportTagSync', () => {
  const getComponentRefByTypeMock = vi.fn();
  const getSceneNodeByRefMock = vi.fn();

  const baseState = {
    getComponentRefByType: getComponentRefByTypeMock,
    getSceneNodeByRef: getSceneNodeByRefMock,
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
    vi.clearAllMocks();
  });

  it('should render correctly', async () => {
    accessStore('default').setState(baseState);
    const { container } = render(<MatterportTagSync />);

    expect(container).toMatchSnapshot();
  });

  it('should sync mattertags by deleting id1, updating id2, and adding id3', async () => {
    accessStore('default').setState(baseState);

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
    expect(handleAddMatterportTagMock).toBeCalledWith({ id: 'id3', item: matterTag3 });
    expect(handleUpdateMatterportTagMock).toBeCalledWith({ ref: 'ref2', node: node2, item: matterTag2 });
    expect(handleRemoveMatterportTagMock).toBeCalledWith('ref1');
  });

  it('should sync matterport tags by deleting id1, updating id2, and adding id3', async () => {
    accessStore('default').setState(baseState);

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
    expect(handleAddMatterportTagMock).toBeCalledWith({ id: 'id3', item: tag2 });
    expect(handleUpdateMatterportTagMock).toBeCalledWith({ ref: 'ref2', node: node2, item: tag3 });
    expect(handleRemoveMatterportTagMock).toBeCalledWith('ref1');
  });
});
