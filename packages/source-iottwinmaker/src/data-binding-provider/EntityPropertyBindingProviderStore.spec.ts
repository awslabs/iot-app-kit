import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { EntityPropertyBindingProviderStore } from './EntityPropertyBindingProviderStore';
import {
  IDataBindingConfig,
  IDataFieldOption,
  IValueDataBindingProviderState,
} from './types';
import flushPromises from 'flush-promises';

describe('EntityPropertyBindingProviderStore', () => {
  const getEntity = jest.fn();
  const listEntities = jest.fn();
  const tmClient = createMockTwinMakerSDK({
    getEntity,
    listEntities,
  });
  const mockWorkspaceId = 'ws-id';
  let metadataModule = new TwinMakerMetadataModule(mockWorkspaceId, tmClient);

  const mapToKV = (key: string): IDataFieldOption => ({
    label: key + '-name',
    value: key + '-id',
  });

  const mockEntityDataFieldOptions = [
    { label: 'e3-name', value: 'e3' },
    mapToKV('entity-option-1'),
    mapToKV('entity-option-2'),
  ];

  const mockDataBindingInput = {
    dataBindingContext: {
      entityId: 'entity-option-1',
      componentName: 'component-3',
      propertyName: 'alarm_key',
    },
  };

  const mockEntitySummary = {
    entitySummaries: [
      {
        entityName: 'entity-option-1-name',
        entityId: 'entity-option-1-id',
      },
      {
        entityName: 'entity-option-2-name',
        entityId: 'entity-option-2-id',
      },
      {
        entityName: 'e3-name',
        entityId: 'e3',
      },
    ],
  };

  const mockSelectedEntity = {
    components: {
      'component-3': {
        componentTypeId: 'mock-componentTypeId',
        properties: {
          alarm_key: { value: { stringValue: 'mock-alarm-key' } },
          alarm_id: {
            definition: { isTimeSeries: false },
            value: { stringValue: 'mock-alarm-id' },
          },
        },
      },
    },
  };

  let providerStore: EntityPropertyBindingProviderStore;

  beforeEach(async () => {
    listEntities.mockResolvedValue(mockEntitySummary);
    getEntity.mockResolvedValue(mockSelectedEntity);
    metadataModule = new TwinMakerMetadataModule(mockWorkspaceId, tmClient);

    providerStore = new EntityPropertyBindingProviderStore({ metadataModule });
    await flushPromises();

    jest.clearAllMocks();
  });

  it('should return a correct state based on the binding input', async () => {
    let updatedState: IValueDataBindingProviderState;
    const onStateChanged = (state: IValueDataBindingProviderState) => {
      updatedState = state;
    };
    providerStore.setOnStateChangedListener(onStateChanged);
    const result = providerStore.setBinding('a', mockDataBindingInput);

    await flushPromises();

    expect(updatedState!.definitions[0].options).toStrictEqual(
      mockEntityDataFieldOptions
    );
    expect(result.selectedOptions).toStrictEqual([
      { value: 'entity-option-1', label: 'entity-option-1' },
      { value: 'component-3', label: 'component-3' },
      { value: 'alarm_key', label: 'alarm_key' },
    ]);
  });

  it('should skip the init if the binding key and binding input is the same', async () => {
    const mockOnChange = jest.fn();
    providerStore.setOnStateChangedListener(mockOnChange);
    providerStore.setBinding('a', mockDataBindingInput);

    await flushPromises();
    mockOnChange.mockReset();

    providerStore.setBinding('a', mockDataBindingInput);

    expect(mockOnChange).not.toBeCalled();
  });

  it('should fetching entity summary and call onError if failed', async () => {
    listEntities.mockRejectedValueOnce({
      message: 'mock error message.',
      name: 'error name',
    });

    const mockOnError = jest.fn();
    metadataModule = new TwinMakerMetadataModule(mockWorkspaceId, tmClient);
    providerStore = new EntityPropertyBindingProviderStore({
      metadataModule,
      onError: mockOnError,
    });

    await flushPromises();

    providerStore.setBinding('a', mockDataBindingInput);
    await flushPromises();

    expect(mockOnError).toBeCalledTimes(1);
    expect(mockOnError).toBeCalledWith('ListEntitiesError', {
      msg: 'mock error message.',
      status: undefined,
      type: 'error name',
    });
  });

  it('should fetch entity if selected entity is set', async () => {
    providerStore.setBinding('a', mockDataBindingInput);

    expect(getEntity).toBeCalledTimes(1);
    expect(getEntity).toBeCalledWith({
      entityId: mockDataBindingInput.dataBindingContext.entityId,
      workspaceId: mockWorkspaceId,
    });
  });

  it('should fetching entity and call onError if failed', async () => {
    listEntities.mockResolvedValue(mockEntitySummary);
    getEntity.mockRejectedValue({
      message: 'mock error message.',
      name: 'error name',
    });
    const mockOnError = jest.fn();
    metadataModule = new TwinMakerMetadataModule(mockWorkspaceId, tmClient);
    providerStore = new EntityPropertyBindingProviderStore({
      metadataModule,
      onError: mockOnError,
    });

    providerStore.setBinding('a', mockDataBindingInput);

    await flushPromises();

    expect(mockOnError).toBeCalledTimes(1);
    expect(mockOnError).toBeCalledWith('GetEntityError', {
      msg: 'mock error message.',
      status: undefined,
      type: 'error name',
    });
  });

  it('should return correct entity selection options', async () => {
    const mockOnChange = jest.fn();
    const mockDataBindingConfig: IDataBindingConfig = {
      fieldMapping: {
        entityId: ['sel_entity'],
      },
      template: {
        sel_entity: 'mock-entity-1',
      },
    };

    providerStore.setOnStateChangedListener(mockOnChange);
    providerStore.setBinding('a', mockDataBindingInput, mockDataBindingConfig);

    await flushPromises();

    expect(
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
        .selectedOptions[0].value
    ).toBe('entity-option-1');
  });

  it('should set property option state to disabled if component is not selected', async () => {
    const mockOnChange = jest.fn();

    providerStore.setOnStateChangedListener(mockOnChange);
    providerStore.setBinding('a', undefined);

    await flushPromises();

    expect(
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
        .definitions[2].state
    ).toBe('disabled');
  });

  it('should receive invalid entity id error when selection is updated with wrong entityId', async () => {
    getEntity.mockRejectedValue('error');
    const state = await providerStore.updateSelection('entityId', {
      value: 'wrong',
      label: 'wrong',
    });

    expect(state.errors?.invalidEntityId).toBeTruthy();
  });

  it('should update selectedOptions when entity selection is in options', async () => {
    const mockOnChange = jest.fn();
    providerStore.setOnStateChangedListener(mockOnChange);

    await providerStore.updateSelection('entityId', {
      value: 'e3',
      label: 'e3-name',
    });

    expect(
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
        .selectedOptions[0].value
    ).toBe('e3');
  });

  it('should update selectedOptions when entity selection is changed', async () => {
    const mockDataBindingConfig: IDataBindingConfig = {
      fieldMapping: {
        entityId: ['sel_entity'],
      },
      template: {
        sel_entity: 'mock-entity-1',
      },
    };

    const mockOnChange = jest.fn();

    providerStore.setOnStateChangedListener(mockOnChange);
    providerStore.setBinding('a', undefined, mockDataBindingConfig);

    await flushPromises();

    await providerStore.updateSelection('entityId', {
      value: 'entity-option-1',
      label: 'entity-option-1',
    });

    expect(
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
        .selectedOptions[0].value
    ).toBe('entity-option-1');

    await providerStore.updateSelection('componentName', {
      value: 'component-3',
      label: 'component-3',
    });
    expect(
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
        .selectedOptions[1].value
    ).toBe('component-3');

    await providerStore.updateSelection('propertyName', {
      value: 'alarm_key',
      label: 'alarm_key',
    });
    expect(
      mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
        .selectedOptions[2].value
    ).toBe('alarm_key');
  });

  it('should create a correct data binding object when createBinding is called with timeseries property', async () => {
    providerStore.setBinding('a', mockDataBindingInput);

    await flushPromises();

    const result = await providerStore.createBinding();

    expect(result).toStrictEqual({
      isStaticData: false,
      dataBindingContext: {
        entityId: 'entity-option-1',
        componentName: 'component-3',
        propertyName: 'alarm_key',
      },
    });
  });

  it('should create a correct data binding object when createBinding is called with non timeseries property', async () => {
    providerStore.setBinding('a', {
      ...mockDataBindingInput,
      dataBindingContext: {
        ...mockDataBindingInput.dataBindingContext,
        propertyName: 'alarm_id',
      },
    });

    await flushPromises();

    const result = await providerStore.createBinding();

    expect(result).toStrictEqual({
      isStaticData: true,
      dataBindingContext: {
        entityId: 'entity-option-1',
        componentName: 'component-3',
        propertyName: 'alarm_id',
      },
    });
  });

  it('should create a correct data binding object when createBinding is called with partial binding', async () => {
    providerStore.setBinding('a', {
      dataBindingContext: { entityId: 'entity-option-1' },
    });

    await flushPromises();

    const result = await providerStore.createBinding();

    expect(result?.dataBindingContext).toStrictEqual({
      entityId: 'entity-option-1',
    });
  });

  it('should return undefined when createBinding is called without entityId selected', async () => {
    const result = await providerStore.createBinding();

    expect(result).toBeUndefined();
  });
});
