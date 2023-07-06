import * as React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { useState, useMemo, useCallback } from 'react';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { createKnowledgeGraphQueryClient } from '@iot-app-kit/react-components/src/components/knowledge-graph/KnowledgeGraphQueries';
import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';
import { AdvancedResultsTable } from './advancedResultsTable';
import { Property } from './model/property';

export interface AdvancedSearchProps {
  kGDatamodule: TwinMakerKGQueryDataModule;
  onSelect: (properties: Property[]) => void;
}

/**
 * When SiteWise sync is turned on with Knowledge Graph
 * it adds a definition field for the propertyId and displayName
 * and adds propertyName as a field.
 */
function executeQueryToProperty(res: ExecuteQueryCommandOutput) {
  const properties: Property[] = [];

  const rows = res.rows;
  const columnDescriptions = res.columnDescriptions;

  let propertyIdIndex, propertyNameIndex, displayNameIndex, assetNameIndex;

  if (rows && columnDescriptions) {
    // First get the index of each property in the rowData
    for (let columnNumber = 0; columnNumber < columnDescriptions.length; columnNumber++) {
      const itemName = columnDescriptions[columnNumber].name;
      switch (itemName) {
        case 'propertyId':
          propertyIdIndex = columnNumber;
          break;
        case 'propertyName':
          propertyNameIndex = columnNumber;
          break;
        case 'displayName':
          displayNameIndex = columnNumber;
          break;
        case 'assetName':
          assetNameIndex = columnNumber;
          break;
      }
    }

    // Construct the properties using the previously determined index
    if (
      propertyIdIndex != undefined &&
      propertyNameIndex != undefined &&
      displayNameIndex != undefined &&
      assetNameIndex != undefined
    ) {
      for (const row of rows) {
        const rowData = row.rowData;
        if (rowData) {
          // Knowledge Graph returns rows that aren't actual properties
          // that contain assetId and don't have a propertyName so we don't want to include those
          if (rowData[propertyIdIndex]) {
            properties.push({
              propertyId: rowData[propertyIdIndex] as string,
              propertyName: rowData[propertyNameIndex] as string,
              displayName: rowData[displayNameIndex] ? (rowData[displayNameIndex] as string) : '-',
              assetName: rowData[assetNameIndex] as string,
            });
          }
        }
      }
    } else {
      console.log('Error parsing Knowledge Graph response. Unable to determine field indices.');
    }
  }

  return properties;
}

/** Advanced search for exploring your AWS IoT SiteWise properties. */
export function AdvancedSearch({ kGDatamodule, onSelect }: AdvancedSearchProps) {
  const [searchTermInput, setSearchTermInput] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);

  const kGResponse = (res: ExecuteQueryCommandOutput) => {
    setProperties(executeQueryToProperty(res));
  };

  const knowledgeGraphQueryClient = useMemo(() => {
    return createKnowledgeGraphQueryClient(kGDatamodule, kGResponse);
  }, [kGDatamodule, kGResponse]);

  const onSearchClicked = useCallback(() => {
    if (searchTermInput) {
      knowledgeGraphQueryClient.findPropertiesByEntityOrPropertyNameOrDisplayName(searchTermInput);
    }
  }, [knowledgeGraphQueryClient, searchTermInput]);

  return (
    <SpaceBetween direction='vertical' size='l'>
      <FormField
        label='Search Term'
        description='This will search across all assets and properties and return all properties that have a field containing the search term.'
      >
        <Input value={searchTermInput} onChange={({ detail }) => setSearchTermInput(detail.value)} />
      </FormField>
      <Button iconName='search' onClick={onSearchClicked}>
        Search
      </Button>
      <AdvancedResultsTable data={properties} onSelect={onSelect}></AdvancedResultsTable>
    </SpaceBetween>
  );
}
