import { AssetTableColumnDefinitionsFactory } from './assetTableColumnDefinitionsFactory';

describe('AssetTableColumnDefinitionsFactory', () => {
  describe('create', () => {
    it('should return an array of column definitions', () => {
      const columnDefinitionFactory = new AssetTableColumnDefinitionsFactory({
        NameLink: () => null,
        onClickNameLink: () => null,
      });

      const columnDefinitions = columnDefinitionFactory.create();

      expect(Array.isArray(columnDefinitions)).toBe(true);
      expect(columnDefinitions.length).toBeGreaterThan(0);
    });

    it('should include specific column definitions', () => {
      const columnDefinitionFactory = new AssetTableColumnDefinitionsFactory({
        NameLink: () => null,
        onClickNameLink: () => null,
      });

      const columnDefinitions = columnDefinitionFactory.create();

      expect(columnDefinitions.some((def) => def.id === 'arn')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'id')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'name')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'description')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'creationDate')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'lastUpdateDate')).toBe(true);
    });
  });
});
