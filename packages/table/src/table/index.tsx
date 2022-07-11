import React, { FunctionComponent } from 'react';
import { PropertyFilter, Table as AWSUITable } from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import { TableProps } from '../utils';
import { defaultI18nStrings, formatPropertyFilterOptions, getDefaultColumnDefinitions } from '../utils/tableHelpers';

export const Table: FunctionComponent<TableProps> = (props) => {
  const { items: userItems, useCollectionOption = { sorting: {} }, columnDefinitions: userColumnDefinitions } = props;
  const { items, collectionProps, propertyFilterProps } = useCollection(userItems, useCollectionOption);
  const { propertyFiltering } = useCollectionOption;
  const columnDefinitions = getDefaultColumnDefinitions(userColumnDefinitions);
  const filteringOptions = formatPropertyFilterOptions(propertyFilterProps.filteringOptions, columnDefinitions, items);
  return (
    <AWSUITable
      {...props}
      items={items}
      {...collectionProps}
      columnDefinitions={columnDefinitions}
      filter={
        propertyFiltering && (
          <PropertyFilter
            {...propertyFilterProps}
            filteringOptions={filteringOptions}
            i18nStrings={defaultI18nStrings}
          />
        )
      }
    />
  );
};
