import type { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import type { ResourceSchema } from '../resource-table/types';

export const ASSET_MODEL_EXPLORER_SCHEMA: ResourceSchema<AssetModelSummary> = {
  name: 'Asset model',
  pluralName: 'Asset models',
  properties: [
    {
      id: 'arn',
      name: 'ARN',
      pluralName: 'ARNs',
      render: ({ arn }) => arn,
      filterOperators: ['!:', ':', '!=', '='],
    },
    {
      id: 'assetModelType',
      name: 'Type',
      pluralName: 'Types',
      render: ({ assetModelType }) => assetModelType,
    },
    {
      id: 'creationDate',
      name: 'Creation date',
      pluralName: 'Creation dates',
      render: ({ creationDate }) => creationDate?.toLocaleDateString(),
    },
    {
      id: 'description',
      name: 'Description',
      pluralName: 'Descriptions',
      render: ({ description }) => description,
    },
    {
      id: 'externalId',
      name: 'External ID',
      pluralName: 'External IDs',
      render: ({ externalId }) => externalId,
    },
    {
      id: 'id',
      name: 'ID',
      pluralName: 'IDs',
      render: ({ id }) => id,
    },
    {
      id: 'lastUpdateDate',
      name: 'Last update date',
      pluralName: 'Last update dates',
      render: ({ lastUpdateDate }) => lastUpdateDate?.toLocaleDateString(),
    },
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      render: ({ name }) => name,
    },
    {
      id: 'state',
      name: 'State',
      pluralName: 'States',
      render: ({ status: { state = '' } = {} }) => state,
    },
  ],
};
