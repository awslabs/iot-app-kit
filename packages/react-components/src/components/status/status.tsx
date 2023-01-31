import {
  StyleSettingsMap,
  TimeQuery,
  TimeSeriesDataRequest,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';
import React, { useEffect, useState } from 'react';
import { Annotations } from '../charts/common/types';
import { LabelsConfig } from '../common/types';
import TimeSeriesConnector from '../time-series-connector/time-series-connector';

import { MinimalViewPortConfig, MessageOverrides, DataStream, ProviderWithViewport, TimeSeriesData } from '../../utils/dataTypes';
import { StatusCell } from './status-cell/status-cell';

import { v4 as uuidv4 } from 'uuid';
import { WidgetGrid } from '../widget-grid/widget-grid';
import { buildProvider } from '../../utils/buildProvider';

const DEFAULT_LABELS_CONFIG: Required<LabelsConfig> = {
  showUnit: true,
  showName: true,
  showValue: true,
};

interface StatusProps {
  labelsConfig: LabelsConfig;
  viewport: MinimalViewPortConfig;
  widgetId: string;
  dataStreams: DataStream[];
  annotations: Annotations;
  isEditing?: boolean;
  messageOverrides?: MessageOverrides;
  renderCell: any;
  styleSettings?: StyleSettingsMap;
  settings: TimeSeriesDataRequestSettings;
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
}

export const Status: React.FC<StatusProps> = ({ labelsConfig, settings = {}, viewport, queries, widgetId, styleSettings, annotations, isEditing = false, messageOverrides = {} }) => {

  const [provider, setProvider] = useState<ProviderWithViewport<TimeSeriesData[]>>();

  widgetId = widgetId ?? uuidv4();
  console.info('initial', queries, widgetId)
  useEffect(() => {
    console.info('effect', queries, provider)

    if (queries.length > 0) {
      const newProvider = buildProvider(queries, settings, viewport, widgetId);

      setProvider(newProvider);
    }

    return () => {
      console.info('STATUS UNMOUNT', provider, queries, settings, viewport);
      provider?.unsubscribe();
    }

  }, [queries, settings, viewport]);

  return (
    <TimeSeriesConnector
      annotations={annotations}
      styleSettings={styleSettings}
      provider={provider}
      renderFunc={({dataStreams}: {dataStreams: DataStream[]}) => {
        console.info('status', queries, settings, viewport);
        return (
          <WidgetGrid
            renderCell={() => <span>okkk</span>}
            collapseVertically={false}
            viewport={viewport}
            widgetId={widgetId}
            dataStreams={dataStreams}
            annotations={annotations}
            isEditing={isEditing}
            queries={queries}
            settings={settings}
            messageOverrides={{
              liveTimeFrameValueLabel: '',
              historicalTimeFrameValueLabel: '',
              noDataStreamsPresentHeader: '',
              noDataStreamsPresentSubHeader: '',
              noDataPresentHeader: '',
              noDataPresentSubHeader: '',
              liveModeOnly: '',
              unsupportedDataTypeHeader: '',
              unsupportedDataTypeSubHeader: '',
              supportedTypes: '',
            }}
          >
            <StatusCell
              labelsConfig={{ ...DEFAULT_LABELS_CONFIG, ...labelsConfig }}
              propertyStream={dataStreams ? dataStreams[0] : undefined}
              isEditing={isEditing}
              messageOverrides={messageOverrides}
              isEnabled={false}
              onChangeLabel={function ({  }: { streamId: string; name: string; }): void {
                throw new Error('Function not implemented.');
              } }        />
          </WidgetGrid>
        )
      }}>
    </TimeSeriesConnector>
  );
}
