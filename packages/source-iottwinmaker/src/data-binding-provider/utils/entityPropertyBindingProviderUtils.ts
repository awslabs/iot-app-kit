import { type EntitySummary } from '@aws-sdk/client-iottwinmaker';
import {
  isDataBindingTemplate,
  undecorateDataBindingTemplate,
} from '../../utils/dataBindingTemplateUtils';
import { type IDataBindingTemplate, type IDataFieldOption } from '../types';

export function createIdenticalLabelOption(value: string): IDataFieldOption {
  return { label: value, value };
}

export function convertDataBindingTemplateId(
  id: string | undefined,
  dataBindingTemplate: IDataBindingTemplate | undefined
): string | undefined {
  if (!id || !isDataBindingTemplate(id) || !dataBindingTemplate) {
    return id;
  }

  const undecoratedId = undecorateDataBindingTemplate(id);
  return dataBindingTemplate[undecoratedId] ?? id;
}

export function convertEntitySummariesToDataFieldOptions(
  entitySummaries: EntitySummary[]
): IDataFieldOption[] {
  const summaries: Record<string, EntitySummary> = {};
  for (const current of entitySummaries || []) {
    if (current.entityId) {
      summaries[current.entityId] = current;
    }
  }

  return Object.keys(summaries)
    .sort()
    .map((entityId) => {
      const label =
        summaries[entityId].entityName ?? summaries[entityId].entityId;
      return { value: entityId, label };
    });
}
