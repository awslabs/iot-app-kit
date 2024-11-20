import { KGDataModule } from './KGDataModule';
import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';

const executeQuery = vi.fn();
const twinMakerClientMock = createMockTwinMakerSDK({
  executeQuery,
});

const kgMetadataModule = new KGDataModule({
  workspaceId: 'wsId',
  twinMakerClient: twinMakerClientMock,
});
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

describe('executeQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get a valid response', async () => {
    const result = await kgMetadataModule.executeQuery({
      queryStatement:
        "SELECT e.entityName FROM EntityGraph MATCH (e) WHERE e.entityName LIKE 'room_%'",
    });

    expect(executeQuery).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get a valid response', async () => {
    const result = await kgMetadataModule.executeQuery({
      queryStatement:
        "SELECT e.entityName FROM EntityGraph MATCH (e) WHERE e.entityName LIKE 'room_%'",
      resultsPerPage: 1,
    });

    expect(executeQuery).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get a valid response', async () => {
    const result = await kgMetadataModule.executeQuery({
      queryStatement:
        "SELECT e.entityName FROM EntityGraph MATCH (e) WHERE e.entityName LIKE 'room_%'",
      maxPagesCount: 1,
    });

    expect(executeQuery).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get a valid response', async () => {
    const result = await kgMetadataModule.executeQuery({
      queryStatement:
        "SELECT e.entityName FROM EntityGraph MATCH (e) WHERE e.entityName LIKE 'room_%'",
      resultsPerPage: 1,
      maxPagesCount: 2,
    });

    expect(executeQuery).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get error when API failed', async () => {
    executeQuery.mockRejectedValue('TwinMaker API failed');

    try {
      await kgMetadataModule.executeQuery({
        queryStatement:
          "SELECT e.entityName FROM EntityGraph MATCH (e) WHERE e.entityName LIKE 'room_%'",
        resultsPerPage: 1,
        maxPagesCount: 2,
      });
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(executeQuery).toBeCalledTimes(1);
    }
  });
});
