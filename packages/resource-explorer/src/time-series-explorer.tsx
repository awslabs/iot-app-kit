import Table from "@cloudscape-design/components/table";
import React, { useState } from "react";

import type { TimeSeriesViewModel } from "./types/view-models";
import { ExplorerHeader } from "./components/explorer-header";
import { ExplorerPagination } from "./components/explorer-pagination";
import { ExplorerPreferences } from "./components/explorer-preferences";
import { ExplorerPropertyFilter } from "./components/explorer-property-filter";
import { useCollection } from "@cloudscape-design/collection-hooks";
import {
  createStringFilterProperty,
  createDateFilterProperty,
} from "./helpers/filtering-properties";
import { useExplorerPreferences } from "./hooks/use-explorer-preferences";
import { useTimeSeries } from "./hooks/use-time-series";
import {
  DataStreamTypeSelect,
  DATA_STREAM_TYPE_OPTIONS,
} from "./components/data-stream-type-select";

export function TimeSeriesExplorer() {
  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ["id"],
    storageKey: "time series explorer preferences",
  });

  const [selectedDataStreamType, setSelectedDataStreamType] = useState(
    DATA_STREAM_TYPE_OPTIONS[0]
  );

  const query = useTimeSeries({
    dataStreamType: selectedDataStreamType.value,
    pageSize: preferences.pageSize,
  });

  const allTimeSeries =
    query.data?.pages.reduce<TimeSeriesViewModel[]>(
      (acc, page) => [...acc, ...page.timeSeries],
      []
    ) ?? [];

  const { items, collectionProps, propertyFilterProps, paginationProps } =
    useCollection(allTimeSeries, {
      propertyFiltering: {
        filteringProperties: [
          createStringFilterProperty({
            key: "arn",
            propertyLabel: "ARN",
            groupValuesLabel: "Time series ARNs",
          }),
          createStringFilterProperty({
            key: "id",
            propertyLabel: "ID",
            groupValuesLabel: "Time series IDs",
          }),
          createStringFilterProperty({
            key: "alias",
            propertyLabel: "Alias",
            groupValuesLabel: "Time series aliases",
          }),
          createStringFilterProperty({
            key: "propertyId",
            propertyLabel: "Property ID",
            groupValuesLabel: "Time series property IDs",
          }),
          createStringFilterProperty({
            key: "assetId",
            propertyLabel: "Asset ID",
            groupValuesLabel: "Time series asset IDs",
          }),
          createStringFilterProperty({
            key: "dataType",
            propertyLabel: "Data Type",
            groupValuesLabel: "Time series data types",
          }),
          createStringFilterProperty({
            key: "dataTypeSpec",
            propertyLabel: "Data Type Spec",
            groupValuesLabel: "Time series data type specs",
          }),
          createDateFilterProperty({
            key: "creationDate",
            propertyLabel: "Creation date",
            groupValuesLabel: "Time series creation dates",
          }),
          createDateFilterProperty({
            key: "lastUpdateDate",
            propertyLabel: "Last update date",
            groupValuesLabel: "Time series update dates",
          }),
        ],
      },
      pagination: {
        pageSize: preferences.pageSize,
      },
      selection: {},
    });

  const { selectedItems = [] } = collectionProps;

  return (
    <>
      <DataStreamTypeSelect
        selectedOption={selectedDataStreamType}
        onChange={setSelectedDataStreamType as any} // TODO: fix type
      />
      <Table
        {...collectionProps}
        selectionType="multi"
        items={items}
        visibleColumns={preferences.visibleContent}
        loading={query.isFetching}
        header={
          <ExplorerHeader
            selectedResourceCount={selectedItems.length}
            totalResourceCount={allTimeSeries.length}
          >
          Data streams
          </ExplorerHeader>
        }
        columnDefinitions={[
          {
            id: "arn",
            header: "ARN",
            cell: (timeSeries) => timeSeries.arn,
          },
          {
            id: "id",
            header: "ID",
            cell: (timeSeries) => timeSeries.id,
          },
          {
            id: "alias",
            header: "Alias",
            cell: (timeSeries) => timeSeries.alias,
          },
          {
            id: "propertyId",
            header: "Property ID",
            cell: (timeSeries) => timeSeries.propertyId,
          },
          {
            id: "assetId",
            header: "Asset ID",
            cell: (timeSeries) => timeSeries.assetId,
          },
          {
            id: "dataType",
            header: "Data Type",
            cell: (timeSeries) => timeSeries.dataType,
          },
          {
            id: "dataTypeSpec",
            header: "Data Type Spec",
            cell: (timeSeries) => timeSeries.dataTypeSpec,
          },
          {
            id: "creationDate",
            header: "Creation date",
            cell: (timeSeries) =>
              timeSeries.creationDate?.toLocaleDateString() ?? "-",
          },
          {
            id: "lastUpdateDate",
            header: "Last update date",
            cell: (timeSeries) =>
              timeSeries.lastUpdateDate?.toLocaleDateString() ?? "-",
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
                label: "Time series fields",
                options: [
                  { id: "arn", label: "ARN" },
                  { id: "id", label: "ID" },
                  { id: "alias", label: "alias" },
                  { id: "propertyId", label: "Property ID" },
                  { id: "assetId", label: "Asset ID" },
                  { id: "dataType", label: "Data type" },
                  { id: "dataTypeSpec", label: "Data type spec" },
                  { id: "creationDate", label: "Creation date" },
                  { id: "lastUpdateDate", label: "Last update date" },
                ],
              },
            ]}
          />
        }
      />
    </>
  );
}
