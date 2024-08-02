import {
  TableResourceDefinition,
  TimeSeriesResourceWithLatestValue,
  ResourceFieldFilterOperator,
} from '@iot-app-kit/react-components';

/** Defines pagination page size options for explorer tables. */
export const SUPPORTED_PAGE_SIZES = [10, 25, 100, 250];

// adjust sticky buttons width in the resource explorer
export const STICKY_BUTTON_WIDTH_FACTOR = 25;

const DEFAULT_STRING_FILTER_OPERATORS = [
  '=',
  '!=',
  ':',
  '!:',
] as const satisfies readonly ResourceFieldFilterOperator[];

export const DEFAULT_TIME_SERIES_TABLE_DEFINITION: TableResourceDefinition<TimeSeriesResourceWithLatestValue> =
  [
    {
      id: 'timeSeriesId',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ timeSeriesId }) => timeSeriesId,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
      defaultIsVisible: false,
    },
    {
      id: 'alias',
      name: 'Alias',
      pluralName: 'Aliases',
      render: ({ alias }) => alias,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'dataType',
      name: 'Data type',
      pluralName: 'Data types',
      render: ({ dataType }) => dataType,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'dataTypeSpec',
      name: 'Data type spec',
      pluralName: 'Data type specs',
      render: ({ dataTypeSpec }) => dataTypeSpec,
      defaultIsVisible: false,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'assetId',
      name: 'Asset ID',
      pluralName: 'Asset IDs',
      render: ({ assetId }) => assetId,
      defaultIsVisible: false,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'propertyId',
      name: 'Property ID',
      pluralName: 'Property IDs',
      render: ({ propertyId }) => propertyId,
      defaultIsVisible: false,
      filterOperators: DEFAULT_STRING_FILTER_OPERATORS,
    },
    {
      id: 'latestValue',
      name: 'Latest value',
      pluralName: 'Latest values',
      render: ({ latestValue }) => latestValue,
    },
    {
      id: 'latestValueTime',
      name: 'Latest value time',
      pluralName: 'Latest value times',
      render: ({ latestValueTimestamp }) =>
        latestValueTimestamp
          ? new Date(latestValueTimestamp * 1000).toLocaleString()
          : '',
    },
  ];
