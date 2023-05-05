import { KGDataModule } from './KGDataModule';
import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';

const executeQuery = jest.fn();
const twinMakerClientMock = createMockTwinMakerSDK({
  executeQuery,
});

const kgMetadataModule = new KGDataModule({
  workspaceId: 'wsId',
  twinMakerClient: twinMakerClientMock,
  queryStatement: "SELECT e.entityName FROM EntityGraph MATCH (e) WHERE e.entityName LIKE 'room_%'",
});

describe('executeQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a valid response', async () => {
    executeQuery.mockResolvedValue({
      columnDescriptions: [
        {
          name: 'EntityName',
          type: 'VALUE',
        },
      ],
      rows: [
        {
          rowData: ['room_0'],
        },
        {
          rowData: ['room_1'],
        },
      ],
      $metadata: {},
    });

    const expected = {
      columnDescriptions: [
        {
          name: 'EntityName',
          type: 'VALUE',
        },
      ],
      rows: [
        {
          rowData: ['room_0'],
        },
        {
          rowData: ['room_1'],
        },
      ],
      $metadata: {},
    };
    const result = await kgMetadataModule.executeQuery();

    expect(executeQuery).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get error when API failed', async () => {
    executeQuery.mockRejectedValue('TwinMaker API failed');

    try {
      await kgMetadataModule.executeQuery();
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(executeQuery).toBeCalledTimes(1);
    }
  });
});
