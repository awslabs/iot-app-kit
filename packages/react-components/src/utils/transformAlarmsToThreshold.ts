import { type Threshold } from '@iot-app-kit/core';
import { type AlarmData } from '../hooks/useAlarms';
import { IoTEventsToSynchroChartsComparisonOperator } from '@iot-app-kit/source-iotsitewise';
import { COMPARATOR_MAP, type COMPARISON_OPERATOR } from '../common/constants';

const createThreshold = ({
  thresholdValue,
  severity,
  labelText,
  comparisonOperator,
  dataStreamId,
}: {
  thresholdValue: number;
  severity: number | undefined;
  labelText: string;
  comparisonOperator: COMPARISON_OPERATOR;
  dataStreamId?: string;
}): Threshold => {
  return {
    color: 'red',
    value: thresholdValue,
    severity: severity,
    showValue: false,
    label: {
      text: labelText,
      show: true,
    },
    comparisonOperator: comparisonOperator,
    dataStreamIds: dataStreamId ? [dataStreamId] : undefined,
  };
};

export const transformAlarmsToThreshold = (
  alarm: AlarmData
): Threshold | undefined => {
  const { models, inputProperty: inputProperties, thresholds } = alarm;
  const modelsFound = models && models.length !== 0;
  const thresholdsFound = thresholds && thresholds?.length !== 0;
  const dataStreamId = alarm.inputProperty?.at(0)?.dataStream?.id;

  if (modelsFound && thresholdsFound) {
    const model = models[0];
    const threshold = thresholds[thresholds.length - 1];

    const thresholdValue =
      threshold.value?.doubleValue ?? threshold.value?.integerValue;
    const comparisonOperator = model.alarmRule?.simpleRule?.comparisonOperator;
    const inputProperty = inputProperties && inputProperties.at(0);

    if (thresholdValue && comparisonOperator && inputProperty) {
      const scComparisonOperator = IoTEventsToSynchroChartsComparisonOperator[
        comparisonOperator
      ] as COMPARISON_OPERATOR;

      return createThreshold({
        labelText: `${inputProperty.property.name} ${COMPARATOR_MAP[scComparisonOperator]} ${thresholdValue}`,
        thresholdValue: thresholdValue,
        severity: model.severity,
        comparisonOperator: scComparisonOperator,
        dataStreamId,
      });
    }
  }
};
