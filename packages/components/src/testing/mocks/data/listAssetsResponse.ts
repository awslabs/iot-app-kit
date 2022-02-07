import { ListAssetsResponse } from '@aws-sdk/client-iotsitewise';
import { NetworkAssetSummary, Modify } from '../../types';

type NetworkListAssetsResponse = Modify<
  ListAssetsResponse,
  {
    assetSummaries: NetworkAssetSummary[];
  }
>;

export const mocklistAssetsResponse: NetworkListAssetsResponse = {
  assetSummaries: [
    {
      arn: 'arn:aws:iotsitewise:us-east-1:650249681718:asset/1aafd293-0d67-4306-a849-2a325247d9c0',
      assetModelId: 'bc1375df-c0fc-4dfa-a267-a3946715e87a',
      creationDate: 1629327591123,
      hierarchies: [
        {
          id: '4044d48a-3f81-4509-af06-75529de975f7',
          name: 'Engine',
        },
      ],
      id: '1aafd293-0d67-4306-a849-2a325247d9c0',
      lastUpdateDate: 1629327592123,
      name: 'Turbine 1',
      status: {
        state: 'ACTIVE',
      },
    },
    {
      arn: 'arn:aws:iotsitewise:us-east-1:650249681718:asset/5a87ad39-9eae-406b-8772-b5c2e2395234',
      assetModelId: 'b59bbc06-5efb-4bbb-8999-94eaf0162b2a',
      creationDate: 1629327593123,
      hierarchies: [],
      id: '5a87ad39-9eae-406b-8772-b5c2e2395234',
      lastUpdateDate: 1629327594123,
      name: 'Wing 1',
      status: {
        state: 'ACTIVE',
      },
    },
  ],
};
