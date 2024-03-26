import React from 'react';
import {
  Table,
  Box,
  SpaceBetween,
  Header,
  Pagination,
} from '@cloudscape-design/components';
import { AnomalyResult } from '../types';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { getColumnDefinitions } from './columnDefinitions';

interface ContributingPropertiesTableProps {
  data?: AnomalyResult[];
  significantDigits?: number;
}

export const ContributingPropertiesTable = ({
  data,
  significantDigits,
}: ContributingPropertiesTableProps) => {
  // give a timestamp to each diagnostic so table can be sorted by time
  const mappedItems =
    data
      ?.map((d) =>
        d.value.diagnostics.map((diag) => ({
          ...diag,
          timestamp: d.value.timestamp,
        }))
      )
      .flat() ?? [];

  const { items, collectionProps, paginationProps } = useCollection(
    mappedItems,
    {
      pagination: { pageSize: 6 },
      sorting: {
        defaultState: {
          sortingColumn: {
            sortingField: 'value',
          },
          isDescending: true,
        },
      },
    }
  );

  const EmptyTable = (
    <Box margin={{ vertical: 'xs' }} textAlign='center' color='inherit'>
      <SpaceBetween size='m'>
        <b>No prediction event selected</b>
      </SpaceBetween>
    </Box>
  );

  const TableHeader = (
    <Header counter={mappedItems.length ? `(${mappedItems.length})` : ''}>
      Contributing properties
    </Header>
  );

  return (
    <div style={{ padding: '0 8px' }}>
      <Table
        {...collectionProps}
        pagination={<Pagination {...paginationProps} />}
        columnDefinitions={getColumnDefinitions(significantDigits)}
        columnDisplay={[
          { id: 'property', visible: true },
          { id: 'contributingPercentage', visible: true },
          { id: 'time', visible: true },
        ]}
        items={items ?? []}
        loadingText='Loading...'
        empty={EmptyTable}
        header={TableHeader}
      />
    </div>
  );
};
