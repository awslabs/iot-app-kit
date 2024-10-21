import Box from '@cloudscape-design/components/box';
import { getPlugin } from '@iot-app-kit/core';
import {
  TimeSeriesExplorer,
  type TimeSeriesExplorerProps,
  type TimeSeriesResource,
} from '@iot-app-kit/react-components';
import React, { memo, useState } from 'react';
import { useClients } from '~/dashboard/clientContext';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import { getCorrectSelectionMode } from '../../helpers/getCorrectSelectionMode';
import { useIsAddButtonDisabled } from '../../helpers/useIsAddButtonDisabled';
import { useQuery } from '../../useQuery';
import { ResourceExplorerFooter } from '../footer/footer';
import { QueryExtender } from '../queryExtender';

type UnmodeledExplorerProps = {
  timeZone?: string;
};

export const UnmodeledExplorer = memo(function ({
  timeZone,
}: UnmodeledExplorerProps) {
  const { iotSiteWise: iotSiteWiseClient } = useClients();
  const [_query, onUpdateQuery] = useQuery();
  const selectedWidgets = useSelectedWidgets();
  const [significantDigits] = useDashboardDecimalPlaces();
  const addButtonDisabled = useIsAddButtonDisabled(selectedWidgets);
  const correctSelectionMode = getCorrectSelectionMode(selectedWidgets);
  const [selectedTimeSeries, setSelectedTimeSeries] = useState<
    NonNullable<TimeSeriesExplorerProps['selectedTimeSeries']>
  >([]);

  const metricsRecorder = getPlugin('metricsRecorder');

  function handleClickAddUnmodeledDataStreams(
    newUnmodeledDataStreams: readonly TimeSeriesResource[]
  ) {
    onUpdateQuery((currentQuery) => {
      const queryExtender = new QueryExtender(currentQuery);
      const updatedQuery = queryExtender.extendPropertyAliasQueries(
        newUnmodeledDataStreams
      );

      return updatedQuery;
    });
  }

  return (
    <Box padding={{ horizontal: 's' }}>
      <TimeSeriesExplorer
        selectionMode={correctSelectionMode}
        iotSiteWiseClient={iotSiteWiseClient}
        onSelectTimeSeries={setSelectedTimeSeries}
        selectedTimeSeries={selectedTimeSeries}
        parameters={[{ timeSeriesType: 'DISASSOCIATED' }]}
        tableSettings={{
          isFilterEnabled: true,
          isUserSettingsEnabled: true,
        }}
        description='Select a unmodeled datastream to add to a selected widget'
        timeZone={timeZone}
        significantDigits={significantDigits}
      />
      <ResourceExplorerFooter
        addDisabled={addButtonDisabled}
        onReset={() => setSelectedTimeSeries([])}
        onAdd={() => {
          handleClickAddUnmodeledDataStreams(selectedTimeSeries);
          setSelectedTimeSeries([]); //clear table after adding it to widget
          metricsRecorder?.record({
            metricName: 'UnmodeledDataStreamAdd',
            metricValue: 1,
          });
        }}
      />
    </Box>
  );
});
