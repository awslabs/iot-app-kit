import { pick } from 'lodash';

import { type IDataBindingTemplate } from '../interfaces';

import { applyDataBindingTemplate, dataBindingConfigSelector, extractEntityId } from './dataBindingTemplateUtils';

describe('dataBindingTemplatesSelector', () => {
  let mockDataBindingConfig;

  beforeEach(() => {
    mockDataBindingConfig = {
      fieldMapping: {
        entityId: ['sel_entity'],
        componentName: ['sel_comp'],
      },
      template: {
        sel_entity: 'my_entity_id',
        sel_comp: 'my_component_name',
      },
    };
  });

  it('should return data binding templates from state', () => {
    const getSceneProperty = vi.fn();
    getSceneProperty.mockReturnValue(mockDataBindingConfig);
    const dataBindingConfig = dataBindingConfigSelector({ getSceneProperty } as any);

    const templateName = dataBindingConfig.fieldMapping.entityId[0];
    expect(templateName).toEqual('sel_entity');
    expect(dataBindingConfig.template?.[templateName]).toEqual('my_entity_id');
  });

  it('should fill missing data binding template keys if they are missing', () => {
    const getSceneProperty = vi.fn();
    const newMockDataBindingConfig = {
      fieldMapping: mockDataBindingConfig.fieldMapping,
      template: pick(mockDataBindingConfig.template, 'sel_comp'),
    };
    getSceneProperty.mockReturnValue(newMockDataBindingConfig);
    const dataBindingConfig = dataBindingConfigSelector({ getSceneProperty } as any);
    const templateName = dataBindingConfig.fieldMapping.entityId[0];
    expect(templateName).toEqual('sel_entity');
    expect(dataBindingConfig.template?.[templateName]).toEqual(undefined);
  });

  it('should use default data binding config if RootState has no data binding config', () => {
    const getSceneProperty = vi.fn();
    getSceneProperty.mockReturnValue(undefined);

    const dataBindingConfig = dataBindingConfigSelector({ getSceneProperty } as any);
    expect(dataBindingConfig.template).toEqual(undefined);
    const entityIdTemplateName = dataBindingConfig.fieldMapping.entityId[0];
    expect(entityIdTemplateName).toEqual('sel_entity');
    const componentNameTemplateName = dataBindingConfig.fieldMapping.componentName[0];
    expect(componentNameTemplateName).toEqual('sel_comp');
  });
});

describe('applyDataBindingTemplate', () => {
  let mockDataBindingTemplate: IDataBindingTemplate;

  beforeEach(() => {
    mockDataBindingTemplate = {
      sel_entity1: 'my_entity_id',
      sel_comp1: 'my_component_name',
      fakeKey1Template: 'fakeKey1Value',
      fakeKey2Template: 'fakeKey2Value',
    };
  });

  it('should return data binding with replaced values from data binding template', () => {
    const dataBinding = { dataBindingContext: { entityId: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' } };
    const dataBindingContext = applyDataBindingTemplate(dataBinding, mockDataBindingTemplate);
    expect(dataBindingContext).toEqual({ entityId: 'fakeKey1Value', fakeKey2: 'fakeKey2Value' });
  });

  it('should return the original data binding for empty data binding template', () => {
    const dataBinding = { dataBindingContext: { entityId: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' } };

    const dataBindingContext1 = applyDataBindingTemplate(dataBinding, undefined);
    expect(dataBindingContext1).toEqual({ entityId: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' });

    const dataBindingContext2 = applyDataBindingTemplate(dataBinding, undefined);
    expect(dataBindingContext2).toEqual({ entityId: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' });
  });

  it('should return undefined if data binding is missing', () => {
    const dataBindingContext = applyDataBindingTemplate(undefined, mockDataBindingTemplate);
    expect(dataBindingContext).toBeUndefined();
  });
});

describe('extractEntityId', () => {
  it('should return entityId', () => {
    const dataBinding = { dataBindingContext: { entityId: 'abcd' } };
    const entityId = extractEntityId(dataBinding);
    expect(entityId).toEqual({ entityId: 'abcd' });
  });
});
