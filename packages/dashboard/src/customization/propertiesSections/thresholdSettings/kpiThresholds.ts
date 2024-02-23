import { OptionDefinition } from '@cloudscape-design/components/internal/components/option/interfaces';
import { ThresholdStyleType } from '@iot-app-kit/core';

enum ThresholdStyleOptions {
  asFilledWidget = 'As filled widget',
  asLine = 'As line',
}

export const styledOptionsKPI = [
  { label: ThresholdStyleOptions.asLine, value: '1' },
  { label: ThresholdStyleOptions.asFilledWidget, value: '2' },
];

export const convertOptionToThresholdStyleKPI = (
  selectedOption: OptionDefinition
): ThresholdStyleType => {
  switch (selectedOption.label) {
    case ThresholdStyleOptions.asLine: {
      return {
        visible: true,
      };
    }
    case ThresholdStyleOptions.asFilledWidget: {
      return {
        visible: true,
        fill: 'color',
      };
    }
    default: {
      return {};
    }
  }
};

export const convertThresholdStyleToOptionKPI = (
  thresholdStyle: ThresholdStyleType
): OptionDefinition => {
  if (!!thresholdStyle.visible && !!thresholdStyle.fill) {
    return styledOptionsKPI[1];
  } else {
    return styledOptionsKPI[0];
  }
};
