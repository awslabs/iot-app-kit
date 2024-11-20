import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { type EntityPropertyBindingProviderStore } from './EntityPropertyBindingProviderStore';
import { createEntityPropertyBindingProvider } from './createEntityPropertyBindingProvider';

describe('createEntityPropertyBindingProvider', () => {
  const getEntity = vi.fn();
  const listEntities = vi.fn();
  const tmClient = createMockTwinMakerSDK({
    getEntity,
    listEntities,
  });
  const mockWorkspaceId = 'ws-id';
  const metadataModule = new TwinMakerMetadataModule(mockWorkspaceId, tmClient);

  const mockDataBindingInput = {
    dataBindingContext: {
      entityId: 'entity-option-1',
      componentName: 'component-3',
      propertyName: 'alarm_key',
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it('should return a correct data binding provider store', async () => {
    const provider = createEntityPropertyBindingProvider({
      metadataModule,
      timeSeriesDataQuery: vi.fn(),
      propertyValueQuery: vi.fn(),
    });
    const store = provider.createStore(false);
    expect(store).toBeDefined();
    expect(
      (store as EntityPropertyBindingProviderStore)['metadataModule']
    ).toBe(metadataModule);
  });

  it('should return time series query when data binding context has all values', async () => {
    const query = { key: 'value' };
    const provider = createEntityPropertyBindingProvider({
      metadataModule,
      timeSeriesDataQuery: vi.fn().mockReturnValue(query),
      propertyValueQuery: vi.fn(),
    });
    const result = provider.createQuery(mockDataBindingInput);
    expect(result).toBe(query);
  });

  it('should return static query when data binding context has all values', async () => {
    const query = { key: 'value' };
    const provider = createEntityPropertyBindingProvider({
      metadataModule,
      timeSeriesDataQuery: vi.fn().mockReturnValue({ random: 'abc' }),
      propertyValueQuery: vi.fn().mockReturnValue(query),
    });
    const result = provider.createQuery({
      ...mockDataBindingInput,
      isStaticData: true,
    });
    expect(result).toBe(query);
  });

  it('should not return query when data binding context misses property name', async () => {
    const query = { key: 'value' };
    const provider = createEntityPropertyBindingProvider({
      metadataModule,
      timeSeriesDataQuery: vi.fn().mockReturnValue(query),
      propertyValueQuery: vi.fn(),
    });
    const result = provider.createQuery({
      dataBindingContext: {
        ...mockDataBindingInput.dataBindingContext,
        propertyName: undefined,
      },
    });
    expect(result).toBeUndefined();
  });
});
