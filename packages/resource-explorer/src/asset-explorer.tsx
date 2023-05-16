import React, { useState } from "react";
import Table from "@cloudscape-design/components/table";
import { FormField, Select } from "@cloudscape-design/components";
import { useCollection } from "@cloudscape-design/collection-hooks";
import { ExplorerHeader } from "./components/explorer-header";
import { ExplorerPagination } from "./components/explorer-pagination";
import { ExplorerPreferences } from "./components/explorer-preferences";
import { ExplorerPropertyFilter } from "./components/explorer-property-filter";
import {
  createDateFilterProperty,
  createStringFilterProperty,
} from "./helpers/filtering-properties";
import { useAssets } from "./hooks/use-assets";
import { useAllAssetModels } from "./hooks/use-all-asset-models";
import { useExplorerPreferences } from "./hooks/use-explorer-preferences";
import type { AssetViewModel } from "./types/view-models";

interface AssetModelSelectProps {
  selectedAssetModelId?: string;
  onChange: (assetModelId: string) => void;
}

function AssetModelSelect(props: AssetModelSelectProps) {
  const query = useAllAssetModels();
  const options = query.data?.map((assetModel) => ({
    value: assetModel.id,
    label: assetModel.name,
    description: assetModel.id,
  }));

  return (
    <FormField
      label="Asset Model"
      description="Select an asset model to filter the assets"
    >
      <Select
        selectedOption={null}
        options={options}
        onChange={({ detail }) =>
          props.onChange(detail.selectedOption.value as string)
        }
        filteringType="auto"
        placeholder="Select an asset model"
      />
    </FormField>
  );
}

export function AssetExplorer() {
  const [selectedAssetModelId, setSelectedAssetModelId] = useState<string>();
  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ["name"],
    storageKey: "asset explorer preferences",
  });

  const query = useAssets({
    assetModelId: selectedAssetModelId,
    pageSize: preferences.pageSize,
  });

  const allAssets =
    query.data?.pages.reduce<AssetViewModel[]>(
      (acc, page) => [...acc, ...page.assets],
      []
    ) ?? [];

  const { items, collectionProps, propertyFilterProps, paginationProps } =
    useCollection(allAssets, {
      propertyFiltering: {
        filteringProperties: [
          createStringFilterProperty({
            key: "arn",
            propertyLabel: "ARN",
            groupValuesLabel: "Asset ARNs",
          }),
          createStringFilterProperty({
            key: "assetModelId",
            propertyLabel: "Asset Model ID",
            groupValuesLabel: "Asset Model IDs",
          }),
          createStringFilterProperty({
            key: "assetModelName",
            propertyLabel: "Asset Model Name",
            groupValuesLabel: "Asset Model Names",
          }),
          createStringFilterProperty({
            key: "id",
            propertyLabel: "ID",
            groupValuesLabel: "Asset IDs",
          }),
          createStringFilterProperty({
            key: "name",
            propertyLabel: "Name",
            groupValuesLabel: "Asset Names",
          }),
          createStringFilterProperty({
            key: "description",
            propertyLabel: "Description",
            groupValuesLabel: "Asset descriptions",
          }),
          createDateFilterProperty({
            key: "creationDate",
            propertyLabel: "Creation date",
            groupValuesLabel: "Asset creation dates",
          }),
          createDateFilterProperty({
            key: "lastUpdateDate",
            propertyLabel: "Last update date",
            groupValuesLabel: "Asset last update dates",
          }),
        ],
      },
      pagination: { pageSize: preferences.pageSize },
      selection: {},
    });

  const { selectedItems = [] } = collectionProps;

  return (
    <>
      <AssetModelSelect
        selectedAssetModelId={selectedAssetModelId}
        onChange={setSelectedAssetModelId}
      />
      <Table
        {...collectionProps}
        selectionType="multi"
        items={items}
        loading={query.isFetching}
        header={
                 <ExplorerHeader
                   selectedResourceCount={selectedItems.length}
                   totalResourceCount={allAssets.length}
                 >
                 Assets
                 </ExplorerHeader>
        }
        visibleColumns={preferences.visibleContent}
        columnDefinitions={[
          { id: "arn", header: "ARN", cell: (asset) => asset.arn },
          { id: "id", header: "ID", cell: (asset) => asset.id },
          {
            id: "name",
            header: "Name",
            cell: (asset) => asset.name,
          },
          {
            id: "description",
            header: "Description",
            cell: (asset) => asset.description,
          },
          {
            id: "creationDate",
            header: "Creation date",
            cell: (asset) => asset.creationDate?.toLocaleDateString() ?? "-",
          },
          {
            id: "lastUpdateDate",
            header: "Last update date",
            cell: (asset) => asset.lastUpdateDate?.toLocaleDateString() ?? "-",
          },
          {
            id: "assetModelId",
            header: "Asset Model ID",
            cell: (asset) => asset.assetModelId,
          },
          {
            id: "assetModelName",
            header: "Asset Model Name",
            cell: (asset) => asset.assetModelName,
          },
        ]}
        filter={<ExplorerPropertyFilter {...propertyFilterProps} />}
        pagination={
          <ExplorerPagination
            {...paginationProps}
            fetchNextPage={query.fetchNextPage}
          />
        }
        preferences={
          <ExplorerPreferences
            preferences={preferences}
            onConfirm={({ detail }) =>
              setPreferences(detail as typeof preferences)
            }
            visibleContentOptions={[
              {
                label: "Asset fields",
                options: [
                  { id: "arn", label: "ARN" },
                  { id: "id", label: "ID" },
                  { id: "name", label: "Name" },
                  { id: "description", label: "Description" },
                  { id: "creationDate", label: "Creation Date" },
                  { id: "lastUpdateDate", label: "Last Update Date" },
                  { id: "assetModelId", label: "Asset Model ID" },
                  { id: "assetModelName", label: "Asset Model Name" },
                ],
              },
            ]}
          />
        }
      />
    </>
  );
}
