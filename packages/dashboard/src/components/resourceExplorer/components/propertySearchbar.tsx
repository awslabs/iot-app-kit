import React, { useState, useContext, useEffect } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import { ClientContext } from '../../dashboard/clientContext';
import { ListTimeSeriesCommand, ListTimeSeriesCommandInput } from '@aws-sdk/client-iotsitewise';
import { ResourceExplorerPanel } from '.';
import { DashboardMessages } from '../../../messages';

interface PropertySearchbarProperty {
  isAssetProperty: boolean;
  name: string;
  id: string;
}

interface ResourceExplorerPropertySearchbarProps {
  messageOverrides: DashboardMessages;
}

export const ResourceExplorerPropertySearchbar: React.FC<ResourceExplorerPropertySearchbarProps> = ({
  messageOverrides,
}) => {
  const [propertySearchCache, setPropertySearchCache] = useState<Record<string, PropertySearchbarProperty[]>>({});
  const [autosuggestValue, setAutosuggestValue] = useState('');
  const client = useContext(ClientContext);
  const [properties, setProperties] = useState<PropertySearchbarProperty[]>([]);

  useEffect(() => {
    if (!client) return;

    if (propertySearchCache[autosuggestValue]) {
      setProperties(propertySearchCache[autosuggestValue]);
      return;
    }

    (async () => {
      const listTimeSeriesCommandOpts: ListTimeSeriesCommandInput = {};
      if (autosuggestValue) {
        listTimeSeriesCommandOpts.aliasPrefix = autosuggestValue;
      }

      const result = await client.send(new ListTimeSeriesCommand(listTimeSeriesCommandOpts));
      if (!result?.TimeSeriesSummaries) return;

      const allProperties = result.TimeSeriesSummaries.map(
        (s) =>
          ({
            isAssetProperty: true,
            name: s.alias || `Unaliased | assetId: ${s.assetId} propertyId: ${s.propertyId}`,
          } as PropertySearchbarProperty)
      );

      const nextPropertySearchCache = structuredClone(propertySearchCache);
      nextPropertySearchCache[autosuggestValue] = allProperties;
      setPropertySearchCache(nextPropertySearchCache);
      setProperties(allProperties);
    })();
  }, [JSON.stringify(client), autosuggestValue]);

  const onSearchChange = ({ detail }: { detail: BaseChangeDetail }) => {
    setAutosuggestValue(detail.value);
  };

  return (
    <>
      <Autosuggest
        value={autosuggestValue}
        onChange={onSearchChange}
        options={[]}
        enteredTextLabel={(value) => `Use: "${value}"`}
        ariaLabel='Property Search'
        placeholder='Search for a property alias...'
        empty='No properties found'
      />

      <SpaceBetween direction='horizontal' size='xs'>
        <ResourceExplorerPanel
          panelItems={properties}
          handlePanelItemClick={() => {}}
          messageOverrides={messageOverrides}
        />
      </SpaceBetween>
    </>
  );
};
