import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Autosuggest from '@cloudscape-design/components/autosuggest';
import Checkbox from '@cloudscape-design/components/checkbox';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import { MaybeSiteWiseAssetTreeSessionInterface } from '../types';
import { AssetPropertiesCache } from '../useAssetProperties';
import { ExtendedPanelAssetSummary } from '..';
import { DashboardMessages } from '~/messages';

interface SearchOption {
  id: string;
  value: string;
}

interface ResourceExplorerSearchbarProps {
  provider: MaybeSiteWiseAssetTreeSessionInterface;
  assetPropertiesCache: AssetPropertiesCache;
  setCrumbsToSearch: () => void;
  setPanelItems: (panelItems: ExtendedPanelAssetSummary[]) => void;
  messageOverrides: DashboardMessages;
}

export const ResourceExplorerSearchbar: React.FC<ResourceExplorerSearchbarProps> = ({
  provider,
  assetPropertiesCache,
  setCrumbsToSearch,
  setPanelItems,
  messageOverrides,
}) => {
  const [autosuggestValue, setAutosuggestValue] = useState('');
  const [showAssets, setShowAssets] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [showAlarms, setShowAlarms] = useState(true);
  const [searchOptions = [], setSearchOptions] = useState<SearchOption[]>([]);

  const checkboxOnChange = (setShowFn: Dispatch<SetStateAction<boolean>>) => {
    return ({ detail }: { detail: { checked: boolean } }) => {
      if (setPanelItems.length > 0) {
        setPanelItems([]);
      }
      setShowFn(detail.checked);
    };
  };

  useEffect(() => {
    if (!provider?.assetNodes || !assetPropertiesCache) return;

    let allAssetsSearchOptions: SearchOption[] = [];
    if (showAssets) {
      allAssetsSearchOptions = Object.entries(provider?.assetNodes).map(([id, asset]) => ({
        ...asset,
        value: asset?.asset?.name || '',
        id,
      }));
    }

    let allPropertiesSearchOptions: SearchOption[] = [];
    const reduceResult: SearchOption[] = [];
    if (showProperties) {
      allPropertiesSearchOptions = Object.entries(assetPropertiesCache).reduce((acc, [id, properties]) => {
        if (properties && properties.length) {
          for (const property of properties) {
            const nextProperty = { ...property, id, value: property.name || '' };
            acc.push(nextProperty);
          }
        }
        return acc;
      }, reduceResult);
    }

    const allSearchOptions = [...allAssetsSearchOptions, ...allPropertiesSearchOptions];

    setSearchOptions(allSearchOptions);
  }, [
    JSON.stringify(provider?.assetNodes),
    JSON.stringify(assetPropertiesCache),
    showProperties,
    showAssets,
    showAlarms,
  ]);

  const onSearchChange = ({ detail }: { detail: BaseChangeDetail }) => {
    setCrumbsToSearch();
    setAutosuggestValue(detail.value);
    let nextPanelItems: ExtendedPanelAssetSummary[] = [];
    try {
      const reduceResult: SearchOption[] = [];
      nextPanelItems = searchOptions.reduce((acc, option) => {
        if (!option.value.includes(detail.value)) return acc;
        const nextPanelItem = { ...option, name: option.value };
        return [...acc, nextPanelItem];
      }, reduceResult);
    } catch (e) {
      console.log(e);
    }
    setPanelItems(nextPanelItems);
  };

  return (
    <>
      <Autosuggest
        value={autosuggestValue}
        onChange={onSearchChange}
        options={searchOptions}
        enteredTextLabel={(value) => `Use: "${value}"`}
        ariaLabel={messageOverrides.resourceExplorer.searchAriaLabel}
        placeholder={messageOverrides.resourceExplorer.searchPlaceholder}
        empty={messageOverrides.resourceExplorer.searchEmpty}
      />

      <SpaceBetween direction='horizontal' size='xs'>
        <Checkbox onChange={checkboxOnChange(setShowAssets)} checked={showAssets}>
          Assets
        </Checkbox>
        <Checkbox onChange={checkboxOnChange(setShowProperties)} checked={showProperties}>
          Properties
        </Checkbox>
        <Checkbox onChange={checkboxOnChange(setShowAlarms)} checked={showAlarms}>
          Alarms
        </Checkbox>
      </SpaceBetween>
    </>
  );
};
