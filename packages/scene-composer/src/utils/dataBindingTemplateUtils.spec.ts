import { pick } from 'lodash';

import { IDataBindingConfig, IDataBindingTemplate } from '../interfaces';

import {
  applyDataBindingTemplate,
  createDataBindingTemplateOptions,
  dataBindingConfigSelector,
  decorateDataBindingTemplate,
  isDataBindingTemplate,
  undecorateDataBindingTemplate,
} from './dataBindingTemplateUtils';

describe('isDataBindingTemplate', () => {
  it('should return true for valid data binding template', () => {
    expect(isDataBindingTemplate('${abc}')).toBe(true);
  });

  it('should return false for empty data binding template', () => {
    expect(isDataBindingTemplate('${}')).toBe(false);
    expect(isDataBindingTemplate('')).toBe(false);
    expect(isDataBindingTemplate()).toBe(false);
  });
});

describe('decorateDataBindingTemplate', () => {
  it('should return decorated data binding template', () => {
    expect(decorateDataBindingTemplate('abc')).toBe('${abc}');
  });
});

describe('undecorateDataBindingTemplate', () => {
  it('should return undecorated data binding template', () => {
    expect(undecorateDataBindingTemplate('${abc}')).toBe('abc');
  });

  it('should return original string for invalid data binding template', () => {
    expect(undecorateDataBindingTemplate('${abc')).toBe('${abc');
  });
});

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
    const getSceneProperty = jest.fn();
    getSceneProperty.mockReturnValue(mockDataBindingConfig);
    const dataBindingConfig = dataBindingConfigSelector({ getSceneProperty } as any);

    const templateName = dataBindingConfig.fieldMapping.entityId[0];
    expect(templateName).toEqual('sel_entity');
    expect(dataBindingConfig.template?.[templateName]).toEqual('my_entity_id');
  });

  it('should fill missing data binding template keys if they are missing', () => {
    const getSceneProperty = jest.fn();
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
    const getSceneProperty = jest.fn();
    getSceneProperty.mockReturnValue(undefined);

    const dataBindingConfig = dataBindingConfigSelector({ getSceneProperty } as any);
    expect(dataBindingConfig.template).toEqual(undefined);
    const entityIdTemplateName = dataBindingConfig.fieldMapping.entityId[0];
    expect(entityIdTemplateName).toEqual('sel_entity');
    const componentNameTemplateName = dataBindingConfig.fieldMapping.componentName[0];
    expect(componentNameTemplateName).toEqual('sel_comp');
  });
});

describe('createDataBindingTemplateOptions', () => {
  let mockDataBindingConfig: IDataBindingConfig;

  beforeEach(() => {
    mockDataBindingConfig = {
      fieldMapping: {
        entityId: ['sel_entity1', 'sel_entity2'],
        componentName: ['sel_comp1', 'sel_comp2'],
      },
      template: {
        sel_entity1: 'my_entity_id',
        sel_comp1: 'my_component_name',
        sel_entity2: 'my_entity_id',
        sel_comp2: 'my_component_name',
      },
    };
  });

  it('should return new options for data binding templates', () => {
    const options = createDataBindingTemplateOptions('entityId', mockDataBindingConfig, '${fake-option}');
    expect(options.length).toBe(2);
    expect(options[1].label).toBe('${sel_entity2}');
  });

  it('should return new options for data binding templates if last selected option is emtpy', () => {
    const options = createDataBindingTemplateOptions('entityId', mockDataBindingConfig, undefined);
    expect(options.length).toBe(2);
    expect(options[1].label).toBe('${sel_entity2}');
  });

  it('should return empty array if data binding templates are empty', () => {
    const options = createDataBindingTemplateOptions('entityId', undefined, '${fake-option}');
    expect(options.length).toBe(0);
  });

  it('should return empty array if last selected option is not data binding template', () => {
    const options = createDataBindingTemplateOptions('entityId', mockDataBindingConfig, 'fake-option');
    expect(options.length).toBe(0);
  });

  it('should return empty array if no data binding reference', () => {
    const newMockDataBindingConfig = {
      fieldMapping: mockDataBindingConfig.fieldMapping,
    };
    const options = createDataBindingTemplateOptions('entityId', newMockDataBindingConfig, '${fake-option}');
    expect(options.length).toBe(0);
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
    const dataBinding = { dataBindingContext: { fakeKey1: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' } };
    const dataBindingContext = applyDataBindingTemplate(dataBinding, mockDataBindingTemplate);
    expect(dataBindingContext).toEqual({ fakeKey1: 'fakeKey1Value', fakeKey2: 'fakeKey2Value' });
  });

  it('should return the original data binding for empty data binding template', () => {
    const dataBinding = { dataBindingContext: { fakeKey1: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' } };

    const dataBindingContext1 = applyDataBindingTemplate(dataBinding, undefined);
    expect(dataBindingContext1).toEqual({ fakeKey1: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' });

    const dataBindingContext2 = applyDataBindingTemplate(dataBinding, undefined);
    expect(dataBindingContext2).toEqual({ fakeKey1: '${fakeKey1Template}', fakeKey2: '${fakeKey2Template}' });
  });

  it('should return empty data binding if data binding is missing', () => {
    const dataBindingContext = applyDataBindingTemplate(undefined, mockDataBindingTemplate);
    expect(dataBindingContext).toEqual({});
  });
});
