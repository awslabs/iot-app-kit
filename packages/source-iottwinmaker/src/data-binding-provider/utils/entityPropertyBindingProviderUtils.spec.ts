import { EntitySummary } from '@aws-sdk/client-iottwinmaker';
import { IDataBindingTemplate } from '../types';
import {
  convertDataBindingTemplateId,
  convertEntitySummariesToDataFieldOptions,
  createIdenticalLabelOption,
} from './entityPropertyBindingProviderUtils';

describe('entityPropertyBindingProviderUtils', () => {
  describe('createIdenticalLabelOption', () => {
    it('should return IDataFieldOption successfully', () => {
      expect(createIdenticalLabelOption('fake-value')).toEqual({
        label: 'fake-value',
        value: 'fake-value',
      });
    });
  });

  describe('convertEntitySummariesToDataFieldOptions', () => {
    it('should convert entity summaries to IDataFieldOption successfully', () => {
      const entitySummaries: EntitySummary[] = [
        { entityId: 'entityId0', entityName: 'enttyName0' } as EntitySummary,
        { entityId: 'entityId1' } as EntitySummary,
        { entityId: 'entityId2', entityName: 'enttyName2' } as EntitySummary,
      ];
      const result = convertEntitySummariesToDataFieldOptions(entitySummaries);
      expect(result[0].label).toBe('enttyName0');
      expect(result[1].value).toBe('entityId1');
      expect(result[2].value).toBe('entityId2');
    });

    it('should return empty when no entity summaries', () => {
      const result = convertEntitySummariesToDataFieldOptions([]);
      expect(result).toBeEmpty();
    });
  });

  describe('convertDataBindingTemplateId', () => {
    let dataBindingTemplate: IDataBindingTemplate;

    beforeEach(() => {
      dataBindingTemplate = {
        MockTemplate1: 'MockReference1',
        MockTemplate2: 'MockReference2',
        MockTemplate3: 'MockReference3',
      };
    });

    it('should convert templatized ID to the reference value.', () => {
      expect(
        convertDataBindingTemplateId('${MockTemplate1}', dataBindingTemplate)
      ).toBe('MockReference1');
      expect(
        convertDataBindingTemplateId('${MockTemplate2}', dataBindingTemplate)
      ).toBe('MockReference2');
      expect(
        convertDataBindingTemplateId('${MockTemplate3}', dataBindingTemplate)
      ).toBe('MockReference3');
    });

    it('should skip convertion is ID is not templatized.', () => {
      expect(
        convertDataBindingTemplateId('MockTemplate1', dataBindingTemplate)
      ).toBe('MockTemplate1');
    });

    it('should skip convertion is ID is undefined.', () => {
      expect(convertDataBindingTemplateId(undefined, dataBindingTemplate)).toBe(
        undefined
      );
    });

    it('should skip convertion is data binding templates array is empty.', () => {
      expect(convertDataBindingTemplateId('${MockTemplate2}', undefined)).toBe(
        '${MockTemplate2}'
      );
    });
  });
});
