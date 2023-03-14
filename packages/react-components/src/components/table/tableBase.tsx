import React from 'react';
import { PropertyFilter, Table } from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { getDefaultColumnDefinitions } from './tableHelpers';
import type { FunctionComponent } from 'react';
import type { TableProps } from './types';

export const TableBase: FunctionComponent<TableProps> = (props) => {
  const {
    items: userItems,
    sorting = {},
    propertyFiltering,
    columnDefinitions: userColumnDefinitions,
    messageOverrides: { propertyFilter },
  } = props;
  const { items, collectionProps, propertyFilterProps } = useCollection(userItems, { sorting, propertyFiltering });
  const columnDefinitions = getDefaultColumnDefinitions(userColumnDefinitions);

  return (
    <Table
      {...props}
      {...collectionProps}
      items={items}
      columnDefinitions={columnDefinitions}
      filter={propertyFiltering && <PropertyFilter {...propertyFilterProps} i18nStrings={propertyFilter} />}
    />
  );
};
