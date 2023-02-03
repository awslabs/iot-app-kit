import React from 'react';
import { DataStream, MinimalViewPortConfig } from '../common/dataTypes';
import { Annotations } from '../common/thresholdTypes';
import { StreamType } from '../common/constants';
import { KpiBase } from './kpiBase';

export const KPI: React.FC<{
  dataStreams: DataStream[];
  viewport: MinimalViewPortConfig;
  annotations?: Annotations;
}> = ({ dataStreams }) => {
  // KPI only supports showing one property stream. All the rest will be ignored. Should not pass in more than one
  // into the properties.
  const propertyStream = dataStreams.find(({ streamType }) => streamType == null);
  const alarmStream = dataStreams.find(({ streamType }) => streamType == StreamType.ALARM);

  return <KpiBase propertyStream={propertyStream} alarmStream={alarmStream} valueColor="black" />;
};
