import React, { useState } from "react";
import Table from "@cloudscape-design/components/table";
import { useCollection } from "@cloudscape-design/collection-hooks";
import { ExplorerHeader } from "./components/explorer-header";
import { ExplorerPagination } from "./components/explorer-pagination";
import { ExplorerPreferences } from "./components/explorer-preferences";
import { ExplorerPropertyFilter } from "./components/explorer-property-filter";
import { createStringFilterProperty } from "./helpers/filtering-properties";
import { useAssetProperties } from "./hooks/use-asset-properties";
import { useExplorerPreferences } from "./hooks/use-explorer-preferences";

interface AssetPropertyExplorerProps {
  assetId: string;
}

export function AssetPropertyExplorer(props: AssetPropertyExplorerProps) {
  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ["name"],
    storageKey: "asset property explorer preferences",
  });
  const query = useAssetProperties(props.assetId);
  const { items, collectionProps, paginationProps, propertyFilterProps } =
    useCollection(query.data ?? [], {
      propertyFiltering: {
        filteringProperties: [
          createStringFilterProperty({
            key: "id",
            propertyLabel: "ID",
            groupValuesLabel: "Property IDs",
          }),
          createStringFilterProperty({
            key: "name",
            propertyLabel: "Name",
            groupValuesLabel: "Property names",
          }),
          createStringFilterProperty({
            key: "dataType",
            propertyLabel: "Data Type",
            groupValuesLabel: "Data Types",
          }),
          createStringFilterProperty({
            key: "dataTypeSpec",
            propertyLabel: "Data Type Spec",
            groupValuesLabel: "Data Type Specs",
          }),
          createStringFilterProperty({
            key: "alias",
            propertyLabel: "Alias",
            groupValuesLabel: "Aliases",
          }),
          createStringFilterProperty({
            key: "unit",
            propertyLabel: "Unit",
            groupValuesLabel: "Units",
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
          Asset properties
        </ExplorerHeader>
      }
      columnDefinitions={[
        { id: "id", header: "ID", cell: (assetProperty) => assetProperty.id },
        {
          id: "name",
          header: "Name",
          cell: (assetProperty) => assetProperty.name,
        },
        {
          id: "dataType",
          header: "Data type",
          cell: (assetProperty) => assetProperty.dataType,
        },
        {
          id: "dataTypeSpec",
          header: "Data type spec",
          cell: (assetProperty) => assetProperty.dataTypeSpec,
        },
        {
          id: "alias",
          header: "Alias",
          cell: (assetProperty) => assetProperty.alias,
        },
        {
          id: "unit",
          header: "Unit",
          cell: (assetProperty) => assetProperty.unit,
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
              label: "Asset property fields",
              options: [
                { id: "id", label: "ID" },
                { id: "name", label: "Name" },
                { id: "dataType", label: "Data type" },
                { id: "dataTypeSpec", label: "Data type spec" },
                { id: "alias", label: "Alias" },
                { id: "unit", label: "Unit" },
              ],
            },
          ]}
        />
      }
    />
  );
}
