import React, { FunctionComponent } from 'react';
import { PropertyFilter, Table as AWSUITable } from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import { TableProps } from '../utils';
import { defaultI18nStrings, getDefaultColumnDefinitions } from '../utils/tableHelpers';

export const Table: FunctionComponent<TableProps> = (props) => {
  const { items, useCollectionOption = { sorting: {} }, columnDefinitions } = props;
  const { collectionProps, propertyFilterProps } = useCollection(items, useCollectionOption);
  return (
    <AWSUITable
      {...props}
      {...collectionProps}
      columnDefinitions={getDefaultColumnDefinitions(columnDefinitions)}
      filter={<PropertyFilter {...propertyFilterProps} i18nStrings={defaultI18nStrings} />}
    />
  );
};
