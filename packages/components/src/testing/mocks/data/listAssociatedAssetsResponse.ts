import { ListAssociatedAssetsResponse } from '@aws-sdk/client-iotsitewise';
import { NetworkAssetSummary, Modify } from '../../types';

type NetworkListAssociatedAssetsResponse = Modify<
  ListAssociatedAssetsResponse,
  {
    assetSummaries: NetworkAssetSummary[];
  }
>;

export const mocklistAssociatedAssetsResponse: NetworkListAssociatedAssetsResponse = {
  assetSummaries: [
    {
      arn: 'arn:aws:iotsitewise:us-east-1:650249681718:asset/6f826c8e-4326-41ef-af57-2f923605bc7c',
      assetModelId: '7cc58ae8-632a-490e-899a-cdf8416b0df7',
      creationDate: 1629327595123,
      hierarchies: [
        {
          id: 'd5a0476b-817e-41b3-bd45-49c910d66ccf',
          name: 'Propeller',
        },
      ],
      id: '6f826c8e-4326-41ef-af57-2f923605bc7c',
      lastUpdateDate: 1629327596123,
      name: 'Engine 1',
      status: {
        state: 'ACTIVE',
      },
    },
    {
      arn: 'arn:aws:iotsitewise:us-east-1:650249681718:asset/dee4346b-0904-4ac9-9573-f3070c619767',
      assetModelId: '7cc58ae8-632a-490e-899a-cdf8416b0df7',
      creationDate: 1629327597123,
      hierarchies: [
        {
          id: 'd5a0476b-817e-41b3-bd45-49c910d66ccf',
          name: 'Propeller',
        },
      ],
      id: 'dee4346b-0904-4ac9-9573-f3070c619767',
      lastUpdateDate: 1629327598123,
      name: 'Engine 2',
      status: {
        state: 'ACTIVE',
      },
    },
  ],
};
