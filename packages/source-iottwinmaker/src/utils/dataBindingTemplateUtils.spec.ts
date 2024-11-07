import { type IDataBindingConfig } from '../data-binding-provider/types';
import {
  createDataBindingTemplateOptions,
  decorateDataBindingTemplate,
  isDataBindingTemplate,
  undecorateDataBindingTemplate,
} from './dataBindingTemplateUtils';

describe('dataBindingTemplateUtils', () => {
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
      const options = createDataBindingTemplateOptions(
        'entityId',
        mockDataBindingConfig,
        '${fake-option}'
      );
      expect(options.length).toBe(2);
      expect(options[1].label).toBe('${sel_entity2}');
    });

    it('should return new options for data binding templates if last selected option is emtpy', () => {
      const options = createDataBindingTemplateOptions(
        'entityId',
        mockDataBindingConfig,
        undefined
      );
      expect(options.length).toBe(2);
      expect(options[1].label).toBe('${sel_entity2}');
    });

    it('should return empty array if data binding templates are empty', () => {
      const options = createDataBindingTemplateOptions(
        'entityId',
        undefined,
        '${fake-option}'
      );
      expect(options.length).toBe(0);
    });

    it('should return empty array if last selected option is not data binding template', () => {
      const options = createDataBindingTemplateOptions(
        'entityId',
        mockDataBindingConfig,
        'fake-option'
      );
      expect(options.length).toBe(0);
    });

    it('should return empty array if no data binding reference', () => {
      const newMockDataBindingConfig = {
        fieldMapping: mockDataBindingConfig.fieldMapping,
      };
      const options = createDataBindingTemplateOptions(
        'entityId',
        newMockDataBindingConfig,
        '${fake-option}'
      );
      expect(options.length).toBe(0);
    });
  });
});
