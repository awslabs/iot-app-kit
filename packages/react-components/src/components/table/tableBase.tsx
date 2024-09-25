import React from 'react';
import {
  Pagination,
  PropertyFilter,
  Table,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { getDefaultColumnDefinitions } from './tableHelpers';
import type { FunctionComponent } from 'react';
import type { TableProps } from './types';
import { DEFAULT_PAGE_SIZE } from './constants';

export const TableBase: FunctionComponent<TableProps> = (props) => {
  const {
    items: userItems,
    sorting = {},
    propertyFiltering,
    columnDefinitions: userColumnDefinitions,
    messageOverrides: { propertyFilter },
    precision,
    paginationEnabled,
    pageSize,
    empty,
  } = props;
  const { items, collectionProps, propertyFilterProps, paginationProps } =
    useCollection(userItems, {
      sorting,
      propertyFiltering,
      pagination: { pageSize: pageSize ?? DEFAULT_PAGE_SIZE },
    });
  const columnDefinitions = getDefaultColumnDefinitions(
    userColumnDefinitions,
    precision
  );

  const pagination = {
    ...(paginationEnabled && {
      pagination: <Pagination {...paginationProps} />,
    }),
  };

  return (
    <Table
      {...props}
      {...collectionProps}
      {...pagination}
      items={items}
      columnDefinitions={columnDefinitions}
      empty={empty}
      filter={
        propertyFiltering && (
          <PropertyFilter
            {...propertyFilterProps}
            expandToViewport
            i18nStrings={propertyFilter}
          />
        )
      }
    />
  );
};
