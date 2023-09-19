import type { ModeledDataStream } from '../types';
import { type TableProps } from '@cloudscape-design/components/table';
import { useLatestValues } from '../../../useLatestValues';

export function createModeledDataStreamColumnDefinitions(
  getLatestValue: ReturnType<typeof useLatestValues>['getLatestValue']
): TableProps<
  ModeledDataStream & { latestValue?: number | string | boolean; latestValueTime?: number }
>['columnDefinitions'] {
  return [
    {
      id: 'name',
      header: 'Name',
      cell: ({ name }) => name,
      sortingField: 'name',
    },
    {
      id: 'latestValue',
      header: 'Latest value',
      cell: ({ assetId = '', propertyId = '' }) => getLatestValue({ assetId, propertyId } as ModeledDataStream)?.value,
      sortingField: 'latestValue',
    },
    {
      id: 'latestValueTime',
      header: 'Latest value time',
      cell: ({ assetId = '', propertyId = '' }) =>
        getLatestValue({ assetId, propertyId } as ModeledDataStream)?.timestamp,
      sortingField: 'latestValueTime',
    },
    {
      id: 'assetName',
      header: 'Asset name',
      cell: ({ assetName }) => assetName,
      sortingField: 'assetName',
    },
    {
      id: 'unit',
      header: 'Unit',
      cell: ({ unit }) => unit,
      sortingField: 'unit',
    },
    {
      id: 'dataType',
      header: 'Data type',
      cell: ({ dataType }) => dataType,
      sortingField: 'dataType',
    },
    {
      id: 'dataTypeSpec',
      header: 'Data type spec',
      cell: ({ dataTypeSpec }) => dataTypeSpec,
      sortingField: 'dataTypeSpec',
    },
  ];
}

export const modeledDataStreamExplorerColumnDefinitions: TableProps<
  ModeledDataStream & { latestValue?: number | string | boolean; latestValueTime: number }
>['columnDefinitions'] = [];
