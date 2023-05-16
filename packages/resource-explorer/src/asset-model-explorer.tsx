import React from "react";
import { useCollection } from "@cloudscape-design/collection-hooks";
import Table from "@cloudscape-design/components/table";

import { ExplorerHeader } from "./components/explorer-header";
import { ExplorerPagination } from "./components/explorer-pagination";
import { ExplorerPreferences } from "./components/explorer-preferences";
import { ExplorerPropertyFilter } from "./components/explorer-property-filter";
import {
  createDateFilterProperty,
  createStringFilterProperty,
} from "./helpers/filtering-properties";
import { useAllAssetModels } from "./hooks/use-all-asset-models";
import { useExplorerPreferences } from "./hooks/use-explorer-preferences";

export function AssetModelExplorer() {
  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ["name"],
    storageKey: "asset model explorer preferences",
  });
  const query = useAllAssetModels();
  const { items, collectionProps, paginationProps, propertyFilterProps } =
    useCollection(query.data ?? [], {
      propertyFiltering: {
        filteringProperties: [
          createStringFilterProperty({
            key: "arn",
            propertyLabel: "ARN",
            groupValuesLabel: "Asset model ARNs",
          }),
          createStringFilterProperty({
            key: "id",
            propertyLabel: "ID",
            groupValuesLabel: "Asset model IDs",
          }),
          createStringFilterProperty({
            key: "name",
            propertyLabel: "Name",
            groupValuesLabel: "Asset model names",
          }),
          createStringFilterProperty({
            key: "description",
            propertyLabel: "Description",
            groupValuesLabel: "Asset model descriptions",
          }),
          createStringFilterProperty({
            key: "status",
            propertyLabel: "Status",
            groupValuesLabel: "Asset model statuses",
          }),
          createDateFilterProperty({
            key: "creationDate",
            propertyLabel: "Creation date",
            groupValuesLabel: "Asset model creation dates",
          }),
          createDateFilterProperty({
            key: "lastUpdateDate",
            propertyLabel: "Last update date",
            groupValuesLabel: "Asset model update dates",
          }),
        ],
      },
      pagination: { pageSize: preferences.pageSize },
      selection: {},
    });

  const { selectedItems = [] } = collectionProps;

  return (
    <Table
      {...collectionProps}
      selectionType="multi"
      items={items}
      loading={query.isFetching}
      visibleColumns={preferences.visibleContent}
      header={
        <ExplorerHeader
          selectedResourceCount={selectedItems.length}
          totalResourceCount={query.data?.length ?? 0}
        >
          Asset Models
        </ExplorerHeader>
      }
      columnDefinitions={[
        { id: "arn", header: "ARN", cell: (assetModel) => assetModel.arn },
        { id: "id", header: "ID", cell: (assetModel) => assetModel.id },
        {
          id: "name",
          header: "Name",
          cell: (assetModel) => assetModel.name,
        },
        {
          id: "description",
          header: "Description",
          cell: (assetModel) => assetModel.description,
        },
        {
          id: "status",
          header: "Status",
          cell: (assetModel) => assetModel.status,
        },
        {
          id: "creationDate",
          header: "Creation date",
          cell: (assetModel) =>
            assetModel.creationDate?.toLocaleDateString() ?? "-",
        },
        {
          id: "lastUpdateDate",
          header: "Last update date",
          cell: (assetModel) =>
            assetModel.lastUpdateDate?.toLocaleDateString() ?? "-",
        },
      ]}
      filter={<ExplorerPropertyFilter {...propertyFilterProps} />}
      pagination={<ExplorerPagination {...paginationProps} />}
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
                { id: "creationDate", label: "Creation date" },
                { id: "lastUpdateDate", label: "Last update date" },
              ],
            },
          ]}
        />
      }
    />
  );
}
