import { cloneDeep } from 'lodash';

import { RootState } from '../store';
import {
  IDataBindingConfig,
  IDataBindingTemplate,
  IDataFieldOption,
  KnownSceneProperty,
  IValueDataBinding,
} from '../interfaces';
import {
  DEFAULT_DATA_BINDING_TEMPLATE_ENTITY_ID,
  DEFAULT_DATA_BINDING_TEMPLATE_COMPONENT_NAME,
} from '../common/constants';

/**
 * Data binding templates will be stored as ${my-value} in IValueDataBinding
 */
const dataBindingTemplateRegExp = /^\$\{([\s\S]+)\}$/;

export const isDataBindingTemplate = (item?: string) => (item ? dataBindingTemplateRegExp.test(item) : false);

export const decorateDataBindingTemplate = (item: string) => '${' + item + '}';

export const undecorateDataBindingTemplate = (item: string) => item.match(dataBindingTemplateRegExp)?.[1] ?? item;

export const dataBindingConfigSelector = (state: RootState): IDataBindingConfig => {
  const dataBindingConfig: IDataBindingConfig =
    cloneDeep(state.getSceneProperty(KnownSceneProperty.DataBindingConfig)) ?? {};
  dataBindingConfig.fieldMapping = dataBindingConfig.fieldMapping ?? {};
  dataBindingConfig.fieldMapping.entityId = dataBindingConfig.fieldMapping.entityId ?? [
    DEFAULT_DATA_BINDING_TEMPLATE_ENTITY_ID,
  ];
  dataBindingConfig.fieldMapping.componentName = dataBindingConfig.fieldMapping.componentName ?? [
    DEFAULT_DATA_BINDING_TEMPLATE_COMPONENT_NAME,
  ];
  return dataBindingConfig;
};

/**
 * Create selection options for data binding templates, these options will be shown on top of existing options. E.g. ${sel_entity} will
 * be shown before all entity IDs
 * @param fieldName field name, e.g. entityId, componnentName
 * @param dataBindingConfig current data binding configuration
 * @param lastSelectedOption only if the last selected option is data binding template, then the current options will include data binding template
 * @returns
 */
export const createDataBindingTemplateOptions = (
  fieldName: string,
  dataBindingConfig?: IDataBindingConfig,
  lastSelectedOption?: string,
): IDataFieldOption[] => {
  if (!dataBindingConfig) {
    return [];
  }

  if (lastSelectedOption && !isDataBindingTemplate(lastSelectedOption)) {
    return [];
  }

  return dataBindingConfig.fieldMapping[fieldName]
    .filter((templateName) => !!dataBindingConfig.template?.[templateName])
    .map(decorateDataBindingTemplate)
    .map((templateName) => ({ value: templateName, label: templateName }));
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
