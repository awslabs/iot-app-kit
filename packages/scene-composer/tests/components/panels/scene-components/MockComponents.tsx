import { IModelRefComponentInternal, ISceneNodeInternal } from '../../../../src/store';
import {
  IDataBindingConfig,
  IValueDataBindingProvider,
  IValueDataBindingStore,
  IValueDataBinding,
  IValueDataBindingProviderState,
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
  dataBindingContext: 'bind',
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
      fieldName: DataBindingLabelKeys.componentTypeId,
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

export const mockBindingStore: IValueDataBindingStore = {
  setBinding: jest.fn(() => {
    return mockBuilderState;
  }),
  updateSelection: jest.fn(),
  createBinding: jest.fn(() => {
    return Promise.resolve(mockBinding);
  }),
  setOnStateChangedListener: jest.fn(),
};

export const mockProvider: IValueDataBindingProvider = {
  useStore: jest.fn(() => {
    return mockBindingStore;
  }),
};

export const mockDataBindingConfig: IDataBindingConfig = {
  fieldMapping: {
    componentName: ['sel_comp'],
    entityId: ['sel_entity'],
  },
};
