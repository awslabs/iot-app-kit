import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';

import { deleteNodeEntity } from './deleteNodeEntity';

describe('deleteNodeEntity', () => {
  const deleteSceneEntity = vi.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    deleteSceneEntity,
  };
  setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);

  it('should call delete entity', async () => {
    await deleteNodeEntity('ref');

    expect(deleteSceneEntity).toBeCalledTimes(1);
    expect(deleteSceneEntity).toBeCalledWith({
      entityId: 'ref',
      isRecursive: true,
    });
  });
});
