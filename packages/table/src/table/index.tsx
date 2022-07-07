import React, { FunctionComponent } from 'react';
import { PropertyFilter, Table as AWSUITable } from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import { TableProps } from '../utils';
import { defaultI18nStrings, getDefaultColumnDefinitions } from '../utils/tableHelpers';

export const Table: FunctionComponent<TableProps> = (props) => {
  const { items: initalItems, useCollectionOption = { sorting: {} }, columnDefinitions } = props;
  const { items, collectionProps, propertyFilterProps } = useCollection(initalItems, useCollectionOption);
  const { propertyFiltering } = useCollectionOption;
  return (
    <AWSUITable
      {...props}
      items={items}
      {...collectionProps}
      columnDefinitions={getDefaultColumnDefinitions(columnDefinitions)}
      filter={propertyFiltering && <PropertyFilter {...propertyFilterProps} i18nStrings={defaultI18nStrings} />}
    />
  );
};
