import {
  IDataBindingConfig,
  IDataFieldOption,
} from '../data-binding-provider/types';

/**
 * Data binding templates will be stored as ${my-value} in IValueDataBinding
 */
const dataBindingTemplateRegExp = /^\$\{([\s\S]+)\}$/;

export const isDataBindingTemplate = (item?: string): boolean =>
  item ? dataBindingTemplateRegExp.test(item) : false;

export const decorateDataBindingTemplate = (item: string): string =>
  '${' + item + '}';

export const undecorateDataBindingTemplate = (item: string): string =>
  item.match(dataBindingTemplateRegExp)?.[1] ?? item;

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
  lastSelectedOption?: string
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
