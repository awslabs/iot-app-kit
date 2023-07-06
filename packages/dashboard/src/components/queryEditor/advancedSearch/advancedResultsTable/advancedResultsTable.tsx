import React, { useState } from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Pagination from '@cloudscape-design/components/pagination';
import Header from '@cloudscape-design/components/header';
import { Property } from '../model/property';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { CollectionPreferences, CollectionPreferencesProps } from '@cloudscape-design/components';
import { columnDefinitions, collectionPreferencesProps, paginationLabels } from './tableConfig';

interface AdvancedResultsTableProps {
  data: Property[];
  onSelect: (properties: Property[]) => void;
}

export function AdvancedResultsTable({ data, onSelect }: AdvancedResultsTableProps) {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 10,
    visibleContent: ['displayName', 'assetName'],
  });
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  const { items, collectionProps, paginationProps } = useCollection(data, {
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {
      keepSelection: true,
    },
  });

  return (
    <Table
      {...collectionProps}
      onSelectionChange={({ detail }) => {
        setSelectedProperties(detail.selectedItems);
        onSelect(detail.selectedItems);
      }}
      ariaLabels={{
        itemSelectionLabel: (isNotSelected, property) =>
          isNotSelected ? `Select property ${property.displayName}` : `Deselect property ${property.displayName}`,
      }}
      header={<Header counter={data.length ? '(' + data.length + ')' : '(0)'}>Results</Header>}
      pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
      variant='embedded'
      sortingDisabled
      columnDefinitions={columnDefinitions}
      visibleColumns={preferences.visibleContent}
      selectedItems={selectedProperties}
      items={items}
      loadingText='Loading results'
      selectionType='multi'
      trackBy='propertyId'
      preferences={
        <CollectionPreferences
          {...collectionPreferencesProps}
          preferences={preferences}
          onConfirm={({ detail }) => setPreferences(detail)}
        />
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No results</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No results to display.
          </Box>
        </Box>
      }
    />
  );
}
