import { TimeSeriesExplorer } from './time-series-explorer';
import { resourceExplorerQueryClient } from '../../resource-explorer-query-client';
import {
  describeDefaultConfiguration,
  describeTableSettings,
} from '../../testing/helpers/common-tests';

describe(TimeSeriesExplorer, () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describeDefaultConfiguration('Time series', TimeSeriesExplorer);
  describeTableSettings('Time series', TimeSeriesExplorer);
});
