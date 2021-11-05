import { DataSource, DataStreamQuery } from '../../data-module/types.d';
import { DATA_STREAM, DATA_STREAM_INFO } from '../../testing/__mocks__/mockWidgetProperties';

/**
 * Simple mocked data source.
 */

export const SOURCE_NAME = 'mock-data-source';

const mockedDataSource: DataSource<DataStreamQuery> = {
  name: SOURCE_NAME,
  initiateRequest: ({ onSuccess }) => {
    onSuccess([DATA_STREAM]);
  },
  getRequestsFromQuery: () => [DATA_STREAM_INFO],
};

export default mockedDataSource;
