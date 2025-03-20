import { useState } from 'react';
import Box from '@cloudscape-design/components/box';
import { ResourceExplorerFooter } from '../footer/footer';
import { type useQuery } from '../useQuery/useQuery';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  type SelectionMode,
  TimeSeriesExplorer,
  type TimeSeriesExplorerProps,
  type TimeSeriesResource,
} from '@iot-app-kit/react-components';
import { getPlugin } from '@iot-app-kit/core';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import { QueryExtender } from '~/components/queryEditor/iotSiteWiseQueryEditor/queryExtender/queryExtender';

export interface UnmodeledExplorerProps {
  onUpdateQuery: ReturnType<typeof useQuery>[1];
  iotSiteWiseClient: IoTSiteWise;
  correctSelectionMode: SelectionMode;
  addButtonDisabled: boolean;
  selectedWidgets: readonly WidgetInstance[];
  timeZone?: string;
  significantDigits?: number;
}

export const UnmodeledExplorer = ({
  onUpdateQuery,
  iotSiteWiseClient,
  correctSelectionMode,
  addButtonDisabled,
  timeZone,
  significantDigits,
}: UnmodeledExplorerProps) => {
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
        description='Select an unmodeled data stream to add to a selected widget.'
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
};
