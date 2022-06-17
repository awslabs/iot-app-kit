import React, { FunctionComponent } from 'react';
import { PropertyFilter, Table as AWSUITable } from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import { TableItem, TableProps } from '../utils';
import { defaultI18nStrings, getDefaultColumnDefinitions } from '../utils/tableHelpers';

export const Table: FunctionComponent<TableProps<TableItem>> = (props) => {
  const { items, useCollectionOption = { sorting: {} }, columnDefinitions } = props;
  const { collectionProps, propertyFilterProps } = useCollection<TableItem>(items, useCollectionOption);
  return (
    <AWSUITable
      className="iot-table"
      {...props}
      {...collectionProps}
      columnDefinitions={getDefaultColumnDefinitions(columnDefinitions)}
      filter={<PropertyFilter {...propertyFilterProps} i18nStrings={defaultI18nStrings} />}
    />
  );
};
