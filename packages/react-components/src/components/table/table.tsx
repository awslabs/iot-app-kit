import React, { useState } from 'react';
import { TableBase } from './tableBase';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import type {
  StyleSettingsMap,
  Threshold,
  TimeSeriesDataQuery,
  Viewport,
} from '@iot-app-kit/core';
import { UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import { TableColumnDefinition, TableItem, TableItemHydrated } from './types';
import { createTableItems } from './createTableItems';
import { DEFAULT_TABLE_MESSAGES } from './messages';
import type { TableProps as TableBaseProps } from '@cloudscape-design/components';
import type { AssistantProperty } from '../../common/assistantProps';
import { useComponentId } from '../../hooks/useComponentId/useComponentId';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';
import { TableHeader } from './tableHeader';
import { TableAssistantResults } from './tableAssistantResults';
import type { AssistantSupportedQuery } from '../../hooks/useAssistantContext/utils';
import { IntlProvider } from 'react-intl';

const DEFAULT_VIEWPORT: Viewport = { duration: '10m' };

export const Table = ({
  queries,
  viewport: passedInViewport,
  thresholds = [],
  columnDefinitions,
  propertyFiltering,
  items,
  sorting,
  styles,
  significantDigits,
  paginationEnabled,
  pageSize,
  ...props
}: {
  columnDefinitions: TableColumnDefinition[];
  queries: TimeSeriesDataQuery[];
  items: TableItem[];
  thresholds?: Threshold[];
  sorting?: UseCollectionOptions<TableItemHydrated>['sorting'];
  propertyFiltering?: UseCollectionOptions<TableItemHydrated>['propertyFiltering'];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  significantDigits?: number;
  paginationEnabled?: boolean;
  pageSize?: number;
  assistant?: AssistantProperty;
  titleText?: string;
} & Pick<
  TableBaseProps,
  | 'resizableColumns'
  | 'sortingDisabled'
  | 'stickyHeader'
  | 'empty'
  | 'preferences'
>) => {
  const componentId = useComponentId();
  const [indexesSelected, setIndexesSelected] = useState<number[]>([]);
  const [showSummarization, setShowSummarization] = useState<boolean>(false);

  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries,
    // Currently set to only fetch raw data.
    // TODO: Support all resolutions and aggregation types
    settings: { fetchMostRecentBeforeEnd: true, resolution: '0' },
    styles,
  });
  const { viewport } = useViewport();
  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group
  const itemsWithData = createTableItems(
    {
      dataStreams,
      items,
      viewport: utilizedViewport,
      thresholds: [...queryThresholds, ...thresholds],
    },
    DEFAULT_TABLE_MESSAGES
  );

  const { setContextByComponent, transformTimeseriesDataToAssistantContext } =
    useAssistantContext();

  const handleSummarize = () => {
    const transformedQueries = transformTimeseriesDataToAssistantContext({
      start: viewportStartDate(utilizedViewport),
      end: viewportEndDate(utilizedViewport),
      queries,
    });
    const filteredQueries = transformedQueries.queries.map((query) => {
      const { properties = [] } = query as AssistantSupportedQuery;
      const filteredProperties = properties.filter((_prop, index) =>
        indexesSelected.includes(index)
      );
      return {
        ...query,
        properties: filteredProperties,
      };
    });
    setContextByComponent(componentId, filteredQueries);
    setShowSummarization(true);
  };

  const component = (
    <IntlProvider locale='en' defaultLocale='en'>
      <TableBase
        {...props}
        items={itemsWithData}
        sorting={sorting}
        columnDefinitions={columnDefinitions}
        propertyFiltering={propertyFiltering}
        messageOverrides={DEFAULT_TABLE_MESSAGES}
        precision={significantDigits}
        paginationEnabled={paginationEnabled}
        pageSize={pageSize}
        onTableSelection={(indexesSelected) =>
          setIndexesSelected(indexesSelected)
        }
        header={
          <TableHeader
            titleText={props.titleText}
            assistant={props.assistant}
            selectedItems={indexesSelected.length}
            totalItems={items.length}
            onSummarize={handleSummarize}
          />
        }
      />
    </IntlProvider>
  );

  if (props.assistant) {
    return (
      <TableAssistantResults
        componentId={componentId}
        assistant={props.assistant}
        showSummarization={showSummarization}
        onSummarizationEnd={() => setShowSummarization(false)}
      >
        {component}
      </TableAssistantResults>
    );
  } else {
    return component;
  }
};
