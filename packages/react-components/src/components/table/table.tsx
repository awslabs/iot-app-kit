import React from 'react';
import { TableBase } from './tableBase';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import type { StyleSettingsMap, Threshold, Viewport } from '@iot-app-kit/core';
import { UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import {
  AlarmItem,
  TableColumnDefinition,
  TableItem,
  TableItemHydrated,
} from './types';
import { createTableItems } from './createTableItems';
import { DEFAULT_TABLE_MESSAGES } from './messages';
import { TableProps as TableBaseProps } from '@cloudscape-design/components';
import type { ComponentQuery } from '../../common/chartTypes';
import { getTimeSeriesQueries } from '../../utils/queries';
import { useAlarmsFromQueries } from '../../hooks/useAlarmsFromQueries/useAlarmsFromQueries';
import { parseAlarmStateAssetProperty } from '../../hooks/useAlarms/transformers';
import { mapAlarmRuleExpression } from '../../hooks/useAlarms/transformers/mapAlarmRuleExpression';

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
} & Pick<
  TableBaseProps,
  | 'resizableColumns'
  | 'sortingDisabled'
  | 'stickyHeader'
  | 'empty'
  | 'preferences'
>) => {
  const alarms = useAlarmsFromQueries({
    transform: (alarm): AlarmItem => {
      const { state, compositeModelName, inputProperty, status } = alarm;
      const firstInputProperty = inputProperty?.at(0);

      return {
        alarmName: compositeModelName,
        property: firstInputProperty?.property.name,
        value: firstInputProperty?.dataStream?.data.at(-1)?.y,
        unit: firstInputProperty?.property.unit,
        state: parseAlarmStateAssetProperty(state?.data?.at(-1))?.value.state,
        alarmExpression: mapAlarmRuleExpression(alarm),
        isLoading: status.isLoading,
        severity: alarm.models?.at(-1)?.severity,
        valueOf: () => undefined,
      };
    },
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
    queries: getTimeSeriesQueries(queries),
    // Currently set to only fetch raw data.
    // TODO: Support all resolutions and aggregation types
    settings: { fetchMostRecentBeforeEnd: true, resolution: '0' },
    styles,
  });
  const { viewport } = useViewport();
  const allThresholds = [...queryThresholds, ...thresholds];

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

  return (
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
    />
  );
};
