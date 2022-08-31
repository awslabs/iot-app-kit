import React, { FunctionComponent } from 'react';
import { PropertyFilter, Table as CSTable } from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { TableProps } from '../utils';
import { getDefaultColumnDefinitions } from '../utils/tableHelpers';

export const Table: FunctionComponent<TableProps> = (props) => {
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
    <CSTable
      {...props}
      items={items}
      {...collectionProps}
      columnDefinitions={columnDefinitions}
      filter={propertyFiltering && <PropertyFilter {...propertyFilterProps} i18nStrings={propertyFilter} />}
    />
  );
};
