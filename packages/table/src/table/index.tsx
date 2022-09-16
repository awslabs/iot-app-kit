import React, { FunctionComponent } from 'react';
import { PropertyFilter, Table as AWSUITable } from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
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
    <AWSUITable
      {...props}
      items={items}
      {...collectionProps}
      columnDefinitions={columnDefinitions}
      filter={propertyFiltering && <PropertyFilter {...propertyFilterProps} i18nStrings={propertyFilter} />}
    />
  );
};
