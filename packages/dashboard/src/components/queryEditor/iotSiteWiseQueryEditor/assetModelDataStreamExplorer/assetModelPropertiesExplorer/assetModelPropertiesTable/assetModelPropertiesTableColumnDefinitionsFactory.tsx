import { AssetModelPropertySummary } from '@aws-sdk/client-iotsitewise';
import { type TableProps } from '@cloudscape-design/components/table';

type AssetModelPropertiesTableColumnDefinitions = TableProps<AssetModelPropertySummary>['columnDefinitions'];

export class AssetModelPropertiesTableColumnDefinitionsFactory {
  public create(): AssetModelPropertiesTableColumnDefinitions {
    return [
      this.#createNameField(),
      this.#createIDField(),
      this.#createUnitField(),
      this.#createDataTypeField(),
      this.#createDataTypeSpecField(),
    ];
  }

  #createIDField(): AssetModelPropertiesTableColumnDefinitions[1] {
    return {
      id: 'id',
      header: 'ID',
      cell: ({ id }) => id,
      sortingField: 'id',
    };
  }

  #createNameField(): AssetModelPropertiesTableColumnDefinitions[0] {
    return {
      sortingField: 'name',
      id: 'name',
      header: 'Name',
      cell: ({ name }) => name,
    };
  }

  #createUnitField(): AssetModelPropertiesTableColumnDefinitions[2] {
    return {
      sortingField: 'unit',
      id: 'unit',
      header: 'Unit',
      cell: ({ unit }) => unit,
    };
  }

  #createDataTypeField(): AssetModelPropertiesTableColumnDefinitions[3] {
    return {
      sortingField: 'dataType',
      id: 'dataType',
      header: 'Data Type',
      cell: ({ dataType }) => dataType,
    };
  }

  #createDataTypeSpecField(): AssetModelPropertiesTableColumnDefinitions[4] {
    return {
      sortingField: 'dataTypeSpec',
      id: 'dataTypeSpec',
      header: 'Data Type Spec',
      cell: ({ dataTypeSpec }) => dataTypeSpec,
    };
  }
}
