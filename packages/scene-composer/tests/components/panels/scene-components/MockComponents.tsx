import { type IModelRefComponentInternal, type ISceneNodeInternal } from '../../../../src/store';
import {
  type IDataBindingConfig,
  type IValueDataBindingProvider,
  type IValueDataBindingStore,
  type IValueDataBinding,
  type IValueDataBindingProviderState,
} from '../../../../src/interfaces';
import { DataBindingLabelKeys } from '../../../../src/common/constants';

export const mockComponent: IModelRefComponentInternal = {
  ref: 'componentRef1',
  type: 'type1',
  uri: 'componentUri',
  modelType: 'componentModelType',
};
export const mockNode: ISceneNodeInternal = {
  ref: 'nodeRef',
  name: 'nodeName',
  transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
  transformConstraint: { snapToFloor: false },
  components: [mockComponent],
  childRefs: ['childRef1', 'childRef2'],
  properties: { hiddenWhileImmersive: true },
};

export const mockBinding: IValueDataBinding = {
  dataBindingContext: { entityId: 'bind' },
};

export const mockBuilderState: IValueDataBindingProviderState = {
  definitions: [
    {
      fieldName: DataBindingLabelKeys.entityId,
      options: [
        {
          label: 'label1',
          value: 'value1',
        },
        {
          label: 'label2',
          value: 'value2',
        },
      ],
      state: 'ready',
    },
    {
      fieldName: DataBindingLabelKeys.componentName,
      options: [
        {
          label: 'label1',
          value: 'value1',
        },
        {
          label: 'label2',
          value: 'value2',
        },
      ],
      state: 'ready',
    },
    {
      fieldName: DataBindingLabelKeys.propertyName,
      options: [
        {
          label: 'label1',
          value: 'value1',
        },
        {
          label: 'label2',
          value: 'value2',
        },
      ],
      state: 'ready',
    },
  ],
  selectedOptions: [
    {
      label: 'label1',
      value: 'value1',
    },
  ],
  errors: {},
};

export const mockUpdateSelection = jest.fn().mockResolvedValue(mockBuilderState);
export const mockBindingStore: IValueDataBindingStore = {
  setBinding: jest.fn().mockReturnValue(mockBuilderState),
  updateSelection: mockUpdateSelection,
  createBinding: jest.fn(() => {
    return Promise.resolve(mockBinding);
  }),
  setOnStateChangedListener: jest.fn().mockImplementation((cb) => cb?.(mockBuilderState)),
};

export const mockProvider: IValueDataBindingProvider = {
  createStore: jest.fn(() => {
    return mockBindingStore;
  }),
  createQuery: jest.fn(),
};

export const mockDataBindingConfig: IDataBindingConfig = {
  fieldMapping: {
    componentName: ['sel_comp'],
    entityId: ['sel_entity'],
  },
};
