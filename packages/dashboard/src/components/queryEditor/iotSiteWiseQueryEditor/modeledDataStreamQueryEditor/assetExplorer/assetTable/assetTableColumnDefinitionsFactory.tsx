import { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { type TableProps } from '@cloudscape-design/components/table';
import React from 'react';

import type { AssetTableNameLinkProps } from './assetTableNameLink';
import { getFormattedDateTime } from '~/components/util/dateTimeUtil';

type AssetTableColumnDefinitions =
  TableProps<AssetSummary>['columnDefinitions'];

export class AssetTableColumnDefinitionsFactory {
  readonly #NameLink: React.ElementType<AssetTableNameLinkProps>;
  readonly #onClickNameLink: AssetTableNameLinkProps['updateParentAssetId'];

  constructor({
    NameLink,
    onClickNameLink,
  }: {
    NameLink: React.ElementType<AssetTableNameLinkProps>;
    onClickNameLink: AssetTableNameLinkProps['updateParentAssetId'];
  }) {
    this.#NameLink = NameLink;
    this.#onClickNameLink = onClickNameLink;
  }

  public create(): AssetTableColumnDefinitions {
    return [
      this.#createARNField(),
      this.#createIDField(),
      this.#createNameField(),
      this.#createDescriptionField(),
      this.#createCreationDateField(),
      this.#createLastUpdateDateField(),
    ];
  }

  #createARNField(): AssetTableColumnDefinitions[1] {
    return {
      id: 'arn',
      header: 'ARN',
      cell: ({ arn }) => arn,
      sortingField: 'arn',
    };
  }

  #createIDField(): AssetTableColumnDefinitions[1] {
    return {
      id: 'id',
      header: 'ID',
      cell: ({ id }) => id,
      sortingField: 'id',
    };
  }

  #createNameField(): AssetTableColumnDefinitions[0] {
    const NameLink = this.#NameLink;

    return {
      sortingField: 'name',
      id: 'name',
      header: 'Name',
      cell: ({ name, id, hierarchies = [] }) => {
        return hierarchies.length > 0 ? (
          <NameLink
            assetId={id ?? '-'}
            assetName={name ?? '-'}
            updateParentAssetId={this.#onClickNameLink}
          />
        ) : (
          name
        );
      },
    };
  }

  #createDescriptionField(): AssetTableColumnDefinitions[1] {
    return {
      id: 'description',
      header: 'Description',
      cell: ({ description }) => description,
      sortingField: 'description',
    };
  }

  #createCreationDateField(): AssetTableColumnDefinitions[1] {
    return {
      id: 'creationDate',
      header: 'Creation Date',
      cell: ({ creationDate }) =>
        creationDate ? getFormattedDateTime(creationDate) : '-',
      sortingField: 'creationDate',
    };
  }

  #createLastUpdateDateField(): AssetTableColumnDefinitions[1] {
    return {
      id: 'lastUpdateDate',
      header: 'Last Update Date',
      cell: ({ lastUpdateDate }) =>
        lastUpdateDate ? getFormattedDateTime(lastUpdateDate) : '-',
      sortingField: 'lastUpdateDate',
    };
  }
}
