import { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';
import { cloneDeep, isEmpty, isEqual } from 'lodash';

import {
  IValueDataBinding,
  IValueDataBindingStore,
  IDataFieldOption,
  IDataBindingConfig,
  IValueDataBindingProviderState,
  ITwinMakerDataBindingContext,
  ITwinMakerEntityDataBindingContext,
} from './types';
import {
  DataField,
  DATA_FIELD_NAMES,
  DATA_BINDING_CONTEXT_KEYS,
  EMPTY_STORE_STATE,
} from './constants';
import { TwinMakerErrorCode } from '../common/error';
import {
  createDataBindingTemplateOptions,
  decorateDataBindingTemplate,
} from '../utils/dataBindingTemplateUtils';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { ErrorDetails } from '@iot-app-kit/core';
import {
  convertDataBindingTemplateId,
  convertEntitySummariesToDataFieldOptions,
  createIdenticalLabelOption,
} from './utils/entityPropertyBindingProviderUtils';

interface ValueDataBindingProviderStore {
  state: IValueDataBindingProviderState;
  currentKey?: string;
  onStateChangedListener?: (state: IValueDataBindingProviderState) => void;
}

const MIN_ENTITY_VALIDATION_COUNT = 3;

export class EntityPropertyBindingProviderStore
  implements IValueDataBindingStore
{
  private readonly isDataBindingTemplateProvider?: boolean;
  private readonly metadataModule: TwinMakerMetadataModule;
  private readonly onError?: (
    errorCode: TwinMakerErrorCode,
    errorDetails?: ErrorDetails
  ) => void;
  private readonly store: ValueDataBindingProviderStore = {
    state: cloneDeep(EMPTY_STORE_STATE),
    onStateChangedListener: undefined,
  };

  private dataBindingConfig?: IDataBindingConfig;
  private lastKey?: string;
  private dataBinding?: IValueDataBinding;
  private selectedEntity?: GetEntityResponse;

  constructor({
    isDataBindingTemplateProvider,
    metadataModule,
    onError,
  }: {
    metadataModule: TwinMakerMetadataModule;
    isDataBindingTemplateProvider?: boolean;
    onError?: (
      errorCode: TwinMakerErrorCode,
      errorDetails?: ErrorDetails
    ) => void;
  }) {
    this.isDataBindingTemplateProvider = isDataBindingTemplateProvider;
    this.metadataModule = metadataModule;
    this.onError = onError;

    this.updateEntitiesList();
  }

  private setDataBindingConfig = (config: IDataBindingConfig | undefined) => {
    this.dataBindingConfig = config;
    this.updateEntitiesList();
    this.updateSelectedEntity();
  };

  private notifyStateChange = () => {
    if (this.store.onStateChangedListener) {
      // we have to make a copy otherwise the this.store will always point to the same object
      this.store.onStateChangedListener(cloneDeep(this.store.state));
    }
  };

  private updateEntitiesList = async () => {
    try {
      const entitySummaries =
        await this.metadataModule.fetchEntitiesSummaries();

      if (entitySummaries) {
        // set entity list enabled
        const options =
          convertEntitySummariesToDataFieldOptions(entitySummaries);
        this.store.state.definitions[DataField.ENTITY_ID].options = !this
          .isDataBindingTemplateProvider
          ? [
              ...createDataBindingTemplateOptions(
                DATA_BINDING_CONTEXT_KEYS.entityId,
                this.dataBindingConfig
              ),
              ...options,
            ]
          : options;
        this.store.state.definitions[DataField.ENTITY_ID].state = 'ready';

        this.updateSelectedEntityName();

        // don't change selection, this assumes the entity summary update does not
        // impact the selected entity's validity. We may strengthen this impl by
        // avoiding this assumption later.

        this.notifyStateChange();
      }
    } catch (error) {
      this.onError?.('ListEntitiesError', error as ErrorDetails);
    }
  };

  setBinding = (
    key: string,
    binding?: IValueDataBinding | undefined,
    dataBindingConfig?: IDataBindingConfig
  ): IValueDataBindingProviderState => {
    if (!binding?.dataBindingContext?.entityId) {
      this.selectedEntity = undefined;
    }

    // if key is different, (e.g. switch to a different anchor)
    // or the binding is different from the last generated one, (e.g. undo)
    // we'll reload
    if (
      this.lastKey !== key ||
      !isEqual(binding, this.dataBinding) ||
      !isEqual(this.dataBindingConfig, dataBindingConfig)
    ) {
      this.lastKey = key;
      this.dataBinding = binding;

      // clear selection
      this.store.state.selectedOptions.splice(0);

      if (binding && !isEmpty(binding.dataBindingContext)) {
        const { dataBindingContext } = binding;
        DATA_FIELD_NAMES.forEach((field) => {
          if (dataBindingContext && field in dataBindingContext) {
            // TODO: entityId is special as we use the entityName as the label
            // maybe we should consider put entityName as part of the dataBindingContext
            // so the select can be initialized with the proper label.
            // for now, we'll only return the value, and rely on the client to
            // properly handle the rendering when label is fetched.
            this.store.state.selectedOptions.push(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              createIdenticalLabelOption((dataBindingContext as any)[field])
            );
          }
        });
      }
      this.setDataBindingConfig(dataBindingConfig);
      this.notifyStateChange();
    }

    return cloneDeep(this.store.state);
  };

  updateSelection = async (fieldName: string, selected: IDataFieldOption) => {
    const store = this.store;

    if (fieldName === DATA_FIELD_NAMES[DataField.ENTITY_ID]) {
      let changeNeeded = false;
      let validEntity = false;

      if (store.state.errors?.invalidEntityId) {
        store.state.errors.invalidEntityId = false;
        changeNeeded = true;
      }
      if (
        store.state.selectedOptions[DataField.ENTITY_ID]?.value !==
        selected.value
      ) {
        if (
          (this.dataBindingConfig?.fieldMapping?.[
            DATA_BINDING_CONTEXT_KEYS?.entityId
          ]?.find((val) => this.dataBindingConfig?.template?.[val]) &&
            this.dataBindingConfig?.fieldMapping?.[
              DATA_BINDING_CONTEXT_KEYS?.entityId
            ].find(
              (val) => decorateDataBindingTemplate(val) === selected.value
            )) ||
          store.state.definitions[DataField.ENTITY_ID].options.find(
            (val) => val.value === selected.value
          )
        ) {
          validEntity = true;
        } else if (
          selected.value &&
          selected.value.length > MIN_ENTITY_VALIDATION_COUNT
        ) {
          try {
            await this.metadataModule.fetchEntity({ entityId: selected.value }); // this should get replaced by entity query in the future.
            validEntity = true;
          } catch (ex) {
            if (!store.state.errors) {
              store.state.errors = {};
            }
            store.state.errors.invalidEntityId = true;
            changeNeeded = true;
          }
        }
      }
      if (validEntity) {
        store.state.selectedOptions[DataField.ENTITY_ID] = selected;
        // clear rest of the selections
        store.state.selectedOptions.splice(DataField.ENTITY_ID + 1);
        changeNeeded = true;
      }
      if (changeNeeded) {
        this.updateSelectedEntity();
      }
    } else if (fieldName === DATA_FIELD_NAMES[DataField.COMPONENT_NAME]) {
      store.state.selectedOptions[DataField.COMPONENT_NAME] = selected;
      // clear rest of the selections
      store.state.selectedOptions.splice(DataField.COMPONENT_NAME + 1);

      // update property list
      this.updateComponentPropertyOptions();
      this.notifyStateChange();
    } else {
      store.state.selectedOptions[DataField.PROPERTY_NAME] = selected;

      this.notifyStateChange();
    }

    return cloneDeep(this.store.state);
  };

  createBinding = (): Promise<IValueDataBinding | undefined> => {
    return new Promise((resolve) => {
      const entityId =
        this.store.state.selectedOptions[DataField.ENTITY_ID]?.value;
      const componentName =
        this.store.state.selectedOptions[DataField.COMPONENT_NAME]?.value;
      const propertyName =
        this.store.state.selectedOptions[DataField.PROPERTY_NAME]?.value;

      if (!entityId) {
        resolve(undefined);
        return;
      }

      const dataBindingContext: ITwinMakerDataBindingContext = { entityId };

      if (componentName)
        (
          dataBindingContext as ITwinMakerEntityDataBindingContext
        ).componentName = componentName;
      if (propertyName)
        (
          dataBindingContext as ITwinMakerEntityDataBindingContext
        ).propertyName = propertyName;

      const dataBinding: IValueDataBinding = {
        dataBindingContext,
      };

      if (componentName && propertyName && this.selectedEntity) {
        // Value of undefined will not be considered as isStaticData = true
        dataBinding.isStaticData =
          this.selectedEntity.components?.[componentName].properties?.[
            propertyName
          ].definition?.isTimeSeries === false;
      }

      this.dataBinding = dataBinding;

      resolve(dataBinding);
    });
  };

  setOnStateChangedListener = (
    listener?: (state: IValueDataBindingProviderState) => void
  ) => {
    this.store.onStateChangedListener = listener;
    // Broadcast the initial store state when the consumer just set the listener
    this.notifyStateChange();
  };

  private updateSelectedEntity = async () => {
    const selectedEntityId: string | undefined = convertDataBindingTemplateId(
      this.store.state.selectedOptions[DataField.ENTITY_ID]?.value,
      this.dataBindingConfig?.template
    );

    if (
      !this.store.state.selectedOptions[DataField.ENTITY_ID]?.value ||
      !selectedEntityId
    ) {
      this.selectedEntity = undefined;
      this.store.state.definitions[DataField.COMPONENT_NAME].state = 'disabled';
      this.store.state.definitions[DataField.PROPERTY_NAME].state = 'disabled';

      this.notifyStateChange();
      return;
    }

    const store = this.store;
    // update store to indicate loading of component/property
    store.state.definitions[DataField.COMPONENT_NAME].state = 'loading';
    store.state.definitions[DataField.PROPERTY_NAME].state = 'loading';

    this.updateSelectedEntityName();
    this.notifyStateChange();

    try {
      const selectedEntity = await this.metadataModule.fetchEntity({
        entityId: selectedEntityId,
      });
      this.selectedEntity = selectedEntity;

      if (selectedEntity) {
        const componentNamesOptions = Object.keys(
          selectedEntity.components ?? {}
        ).map((componentName) => createIdenticalLabelOption(componentName));

        this.store.state.definitions[DataField.COMPONENT_NAME].options = !this
          .isDataBindingTemplateProvider
          ? [
              ...createDataBindingTemplateOptions(
                DATA_BINDING_CONTEXT_KEYS.componentName,
                this.dataBindingConfig
              ),
              ...componentNamesOptions,
            ]
          : componentNamesOptions;
        this.store.state.definitions[DataField.COMPONENT_NAME].state = 'ready';
        this.updateComponentPropertyOptions();

        this.notifyStateChange();
      }
    } catch (error) {
      this.onError?.('GetEntityError', error as ErrorDetails);
    }
  };

  private updateSelectedEntityName = () => {
    const entityOptions =
      this.store.state.definitions[DataField.ENTITY_ID].options;

    // refresh selected entityName
    this.store.state.selectedOptions = this.store.state.selectedOptions.map(
      (option) =>
        option
          ? {
              value: option.value,
              label:
                entityOptions.find((o) => o.value === option.value)?.label ??
                option.value,
            }
          : null
    );
  };

  private updateComponentPropertyOptions = () => {
    const selectedComponentName = convertDataBindingTemplateId(
      this.store.state.selectedOptions[DataField.COMPONENT_NAME]?.value,
      this.dataBindingConfig?.template
    );

    if (
      selectedComponentName !== undefined &&
      this.selectedEntity?.components !== undefined &&
      selectedComponentName in this.selectedEntity.components
    ) {
      // update property list if a component is selected
      const selectedComponent =
        this.selectedEntity.components[selectedComponentName];
      this.store.state.definitions[DataField.PROPERTY_NAME].options =
        Object.entries(selectedComponent.properties ?? {}).map(
          ([id, property]) => ({
            value: id,
            label: property.definition?.displayName || id,
          })
        );
      this.store.state.definitions[DataField.PROPERTY_NAME].state = 'ready';
    } else {
      // disable the property list if no component is selected or the selected component doesn't exist (bug)
      this.store.state.definitions[DataField.PROPERTY_NAME].state = 'disabled';
    }
  };
}
