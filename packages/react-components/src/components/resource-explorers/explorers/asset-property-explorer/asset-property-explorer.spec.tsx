import { AssetPropertyExplorer } from './asset-property-explorer';
import { resourceExplorerQueryClient } from '../../resource-explorer-query-client';
import {
  describeDefaultConfiguration,
  describeTableSettings,
} from '../../testing/helpers/common-tests';

describe(AssetPropertyExplorer, () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describeDefaultConfiguration('Asset properties', AssetPropertyExplorer);
  describeTableSettings('Asset properties', AssetPropertyExplorer, true);
});
