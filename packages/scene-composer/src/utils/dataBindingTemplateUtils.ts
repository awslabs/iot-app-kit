import { cloneDeep, pick } from 'lodash';
import {
  IDataBindingConfig,
  IDataBindingTemplate,
  undecorateDataBindingTemplate,
} from '@iot-app-kit/source-iottwinmaker';

import {
  DEFAULT_DATA_BINDING_TEMPLATE_COMPONENT_NAME,
  DEFAULT_DATA_BINDING_TEMPLATE_ENTITY_ID,
  DataBindingLabelKeys,
} from '../common/constants';
import { IValueDataBinding, KnownSceneProperty } from '../interfaces';
import { RootState } from '../store';

export const dataBindingConfigSelector = (state: RootState): IDataBindingConfig => {
  const dataBindingConfig: IDataBindingConfig = cloneDeep(
    state.getSceneProperty(KnownSceneProperty.DataBindingConfig),
  ) ?? { fieldMapping: {} };
  dataBindingConfig.fieldMapping.entityId = dataBindingConfig.fieldMapping.entityId ?? [
    DEFAULT_DATA_BINDING_TEMPLATE_ENTITY_ID,
  ];
  dataBindingConfig.fieldMapping.componentName = dataBindingConfig.fieldMapping.componentName ?? [
    DEFAULT_DATA_BINDING_TEMPLATE_COMPONENT_NAME,
  ];
  return dataBindingConfig;
};

// Undecorate data binding (from "${XX} to XXX").
//
// Example of dataBinding
// {
//   "dataBindingContext": {
//     "entityId": "${sel_entity}",
//     "componentName": "${sel_comp}",
//     "propertyName": "temperature"
//    }
// }
//
// Example of dataBindingTemplate
// {
//   "sel_entity": "room1",
//   "sel_comp": "temperatureSensor2"
// },
export function applyDataBindingTemplate(
  dataBinding?: IValueDataBinding,
  dataBindingTemplate?: IDataBindingTemplate,
): Record<string, string> {
  if (!dataBinding?.dataBindingContext || !dataBindingTemplate) {
    return (dataBinding?.dataBindingContext ?? {}) as Record<string, string>;
  }

  const dataBindingContext = cloneDeep(dataBinding.dataBindingContext) as {};
  const bindingKeys = Object.keys(dataBinding.dataBindingContext as any);
  bindingKeys.forEach((bindingKey) => {
    const undecoratedBindingValue = undecorateDataBindingTemplate(dataBindingContext[bindingKey]);
    dataBindingContext[bindingKey] = dataBindingTemplate[undecoratedBindingValue] ?? dataBindingContext[bindingKey];
  });
  return dataBindingContext;
}

/**
 * We extract entityId from the data binding object.
 * @param dataBinding we send data binding object
 * @returns
 */
export const extractEntityId = (dataBinding: IValueDataBinding): Record<string, string> => {
  const contextData = dataBinding.dataBindingContext ?? {};
  return pick(contextData, [DataBindingLabelKeys.entityId]);
};
