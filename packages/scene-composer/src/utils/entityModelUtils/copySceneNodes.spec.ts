import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';

import { copySceneNodes } from './copySceneNodes';
import { cloneSceneNodes, createSceneRootEntity, fetchSceneNodes, saveSceneNodes } from './sceneUtils';

vi.mock('./sceneUtils', () => ({
  cloneSceneNodes: vi.fn(),
  createSceneRootEntity: vi.fn(),
  fetchSceneNodes: vi.fn(),
  saveSceneNodes: vi.fn(),
}));

const srcNodes = [{ ref: 'node1' }, { ref: 'node2', parentRef: 'node1' }];
const destNodes = [{ ref: 'node3' }, { ref: 'node4', parentRef: 'node3' }];

describe('copySceneNodes', () => {
  const createSceneEntity = vi.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    createSceneEntity,
    getSceneId: vi.fn().mockReturnValue('testSceneId'),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);

    (cloneSceneNodes as vi.Mock).mockImplementation(() => {
      return Promise.resolve(destNodes);
    });
    (fetchSceneNodes as vi.Mock).mockImplementation(() => {
      return Promise.resolve(srcNodes);
    });
  });

  it('should call related functions', async () => {
    const sourceSceneRootEntityId = 'src-scene-root-entity-id';
    const sceneCopyId = 'mockCopyScene';
    await copySceneNodes({ sourceSceneRootEntityId, sceneCopyId });

    expect(createSceneRootEntity).toBeCalledTimes(1);
    expect(fetchSceneNodes).toBeCalledTimes(1);
    expect(cloneSceneNodes).toBeCalledTimes(1);
    expect(saveSceneNodes).toBeCalledTimes(1);
  });
});
