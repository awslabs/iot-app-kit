import { useCallback, useMemo, useState } from 'react';
import { TableBase } from './tableBase';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import type { StyleSettingsMap, Threshold, Viewport } from '@iot-app-kit/core';
import { type UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import {
  type AlarmItem,
  type TableColumnDefinition,
  type TableItem,
  type TableItemHydrated,
} from './types';
import { createTableItems } from './createTableItems';
import { DEFAULT_TABLE_MESSAGES } from './messages';
import type { TableProps as TableBaseProps } from '@cloudscape-design/components';
import type { AssistantProperty } from '../../common/assistantProps';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';
import { TableHeader } from './tableHeader';
import { TableAssistantResults } from './tableAssistantResults';
import { IntlProvider } from 'react-intl';
import type { ComponentQuery } from '../../common/chartTypes';
import { getTimeSeriesQueries } from '../../utils/queries';
import { useAlarmsFromQueries } from '../../hooks/useAlarmsFromQueries/useAlarmsFromQueries';
import { parseAlarmStateAssetProperty } from '../../hooks/useAlarms/transformers';
import { mapAlarmRuleExpression } from '../../hooks/useAlarms/transformers/mapAlarmRuleExpression';
import {
  convertToSupportedTimeRange,
  getSelectedQueriesAndProperties,
} from '../../hooks/useAssistantContext/utils';
import { type AlarmData } from '../../hooks/useAlarms';
import { transformAlarmsToThreshold } from '../../utils/transformAlarmsToThreshold';
import { createNonNullableList } from '../../utils/createNonNullableList';

const DEFAULT_VIEWPORT: Viewport = { duration: '10m' };

/**
 * Alarm table column definitions are going to be handled
 * internally in the component. They will not be configurable
 * from external users. They will be injected along side
 * user defined column definitions if alarm queries
 * are present within the table queries option.
 */
const ALARM_TABLE_COLUMN_DEFINITIONS: TableColumnDefinition[] = [
  {
    key: 'alarmName',
    header: 'Alarm Name',
    sortingField: 'alarmName',
  },
  {
    key: 'alarmExpression',
    header: 'Alarm Expression',
    sortingField: 'alarmExpressions',
  },
  {
    key: 'alarmState',
    header: 'State',
    sortingField: 'alarmState',
  },
  {
    key: 'alarmSeverity',
    header: 'Severity',
    sortingField: 'alarmSeverity',
  },
];

export const Table = ({
  queries,
  viewport: passedInViewport,
  thresholds = [],
  columnDefinitions: userDefinedColumnDefinitions,
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
  queries: ComponentQuery[];
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
  const [indexesSelected, setIndexesSelected] = useState<number[]>([]);
  const [showSummarization, setShowSummarization] = useState<boolean>(false);
  const timeSeriesQueries = getTimeSeriesQueries(queries);
  const transform = useCallback((alarm: AlarmData): AlarmItem => {
    const { state, compositeModelName, inputProperty, status } = alarm;
    const firstInputProperty = inputProperty?.at(0);

    return {
      id: alarm.compositeModelId,
      assetId: alarm.assetId,
      alarmName: compositeModelName,
      property: firstInputProperty?.property.name,
      value: firstInputProperty?.dataStream?.data.at(-1)?.y,
      unit: firstInputProperty?.property.unit,
      state: parseAlarmStateAssetProperty(state?.data?.at(-1))?.value.state,
      alarmExpression: mapAlarmRuleExpression(alarm),
      isLoading: status.isLoading,
      severity: alarm.models?.at(-1)?.severity,
      threshold: transformAlarmsToThreshold(alarm),
      valueOf: () => undefined,
    };
  }, []);
  const alarms = useAlarmsFromQueries({
    transform,
    queries,
    viewport: passedInViewport,
    settings: {
      fetchInputPropertyData: true,
      fetchThresholds: true,
      fetchOnlyLatest: true,
    },
  });

  const columnDefinitions = [
    ...(alarms.length > 0 ? ALARM_TABLE_COLUMN_DEFINITIONS : []),
    ...userDefinedColumnDefinitions,
  ];

  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: timeSeriesQueries,
    // Currently set to only fetch raw data.
    // TODO: Support all resolutions and aggregation types
    settings: { fetchMostRecentBeforeEnd: true, resolution: '0' },
    styles,
  });
  const { viewport } = useViewport();
  const allThresholds = useMemo(
    () => [
      ...queryThresholds,
      ...thresholds,
      ...createNonNullableList(alarms.map((a) => a.threshold)),
    ],
    [queryThresholds, thresholds, alarms]
  );

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group
  const itemsWithData = createTableItems(
    {
      dataStreams,
      items,
      viewport: utilizedViewport,
      thresholds: allThresholds,
      alarms,
    },
    DEFAULT_TABLE_MESSAGES
  );

  const { setContextByComponent, transformTimeseriesDataToAssistantContext } =
    useAssistantContext();

  const buildAssistantContext = (selectedIndexes: number[]) => {
    const contexts = [];
    const selectedItemsWithData = itemsWithData.filter((_, index) =>
      selectedIndexes.includes(index)
    );

    selectedItemsWithData
      .filter((alarmItem) => !!alarmItem.alarmName)
      .forEach((alarmItem) => {
        contexts.push({
          timerange: convertToSupportedTimeRange(
            viewportStartDate(utilizedViewport),
            viewportEndDate(utilizedViewport)
          ),
          assetId: alarmItem.assetId.value,
          alarmName: alarmItem.alarmName.value,
        });
      });

    const selectedIds = selectedItemsWithData
      .filter((item) => !item.alarmName)
      .map((item) => item.value?.refId ?? '');

    const selectedQueries = getSelectedQueriesAndProperties(
      timeSeriesQueries,
      selectedIds
    );

    contexts.push(
      transformTimeseriesDataToAssistantContext({
        start: viewportStartDate(utilizedViewport),
        end: viewportEndDate(utilizedViewport),
        queries: selectedQueries,
      })
    );

    if (props.assistant) {
      setContextByComponent(props.assistant.componentId, contexts);
    }
  };

  const handleSummarize = () => {
    if (props.assistant) {
      buildAssistantContext(indexesSelected);
      setShowSummarization(true);
    }
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
        onTableSelection={(indexesSelected) => {
          setIndexesSelected(indexesSelected);
          if (
            props.assistant &&
            props.assistant.onAction &&
            props.assistant.target === 'dashboard'
          ) {
            buildAssistantContext(indexesSelected);
            props.assistant.onAction({
              type: 'selection',
              sourceComponentId: props.assistant.componentId,
              sourceComponentType: 'table',
              selectedProperties: indexesSelected.length,
            });
          }
        }}
        header={
          props.assistant?.target === 'widget' && (
            <TableHeader
              titleText={props.titleText}
              assistant={props.assistant}
              selectedItems={indexesSelected.length}
              totalItems={items.length}
              onSummarize={handleSummarize}
            />
          )
        }
      />
    </IntlProvider>
  );

  if (props.assistant) {
    return (
      <TableAssistantResults
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
