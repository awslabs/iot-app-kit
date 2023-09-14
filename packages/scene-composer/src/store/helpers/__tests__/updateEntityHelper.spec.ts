import { waitFor } from '@testing-library/dom';

import { updateEntity } from '../updateEntityHelper';

describe('updateEntity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  jest.mock('../../../common/GlobalSettings');

  it('should update entity correctly', async () => {
    type ISceneComponentInternal = Partial<unknown>;
    const compToBeUpdated: ISceneComponentInternal = {};
    type MyType = Partial<{ properties: { matterportId: string } }>;
    const node: MyType = {
      properties: {
        matterportId: 'abc',
      },
    };
    const layerId = 'layer123';
    const type = 'Tag';
    const sceneMetadataModule = {
      updateSceneEntity: jest.fn(),
    };

    const updateNodeEntityComponent = jest.fn().mockReturnValue({});
    const updateTagEntityComponent = jest.fn().mockReturnValue({
      propertyUpdates: {
        chosenColor: {
          value: {
            stringValue: '#ea7158',
          },
        },
      },
    });
    const updateOverlayEntityComponent = jest.fn().mockReturnValue({});

    await updateEntity(compToBeUpdated, node, layerId, type);
    waitFor(() => {
      expect(jest.fn().mockReturnValue({ twinMakerSceneMetadataModule: sceneMetadataModule })).toHaveBeenCalledTimes(1);
      expect(sceneMetadataModule.updateSceneEntity).toHaveBeenCalledTimes(1);
      expect(updateNodeEntityComponent).toHaveBeenCalledTimes(1);
      expect(updateNodeEntityComponent).toHaveBeenCalledWith(node, layerId);
      expect(updateTagEntityComponent).toHaveBeenCalledTimes(1);
      expect(updateOverlayEntityComponent).toHaveBeenCalledTimes(0);
      expect(sceneMetadataModule.updateSceneEntity).toHaveBeenCalledWith({
        workspaceId: undefined,
        entityId: node.ref,
        entityName: node.name + '_' + node.ref,
        componentUpdates: {
          Node: {},
          Tag: {
            propertyUpdates: {
              chosenColor: {
                value: {
                  stringValue: '#ea7158',
                },
              },
            },
          },
        },
      });
    });
  });
});
