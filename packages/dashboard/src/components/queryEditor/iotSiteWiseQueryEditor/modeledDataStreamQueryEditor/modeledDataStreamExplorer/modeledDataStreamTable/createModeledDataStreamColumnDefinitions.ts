import { isNumeric, round } from '@iot-app-kit/core-util';
import { type TableProps } from '@cloudscape-design/components/table';
import type { ModeledDataStream } from '../types';
import { formatDate } from '@iot-app-kit/react-components';

export function createModeledDataStreamColumnDefinitions(
  significantDigits: number,
  timeZone?: string
): TableProps<
  ModeledDataStream & {
    latestValue?: number | string | boolean;
    latestValueTime?: number;
  }
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
      cell: ({ latestValue }) => {
        if (latestValue && isNumeric(latestValue)) {
          return round(latestValue, significantDigits);
        }
        return latestValue;
      },
      sortingField: 'latestValue',
    },
    {
      id: 'latestValueTime',
      header: 'Latest value time',
      cell: ({ latestValueTime }) => {
        if (!latestValueTime) return '-';
        return formatDate(latestValueTime * 1000, { timeZone });
      },
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
  ModeledDataStream & {
    latestValue?: number | string | boolean;
    latestValueTime: number;
  }
>['columnDefinitions'] = [];
