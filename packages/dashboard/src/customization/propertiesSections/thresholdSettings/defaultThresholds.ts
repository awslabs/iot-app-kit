import { OptionDefinition } from '@cloudscape-design/components/internal/components/option/interfaces';
import { ThresholdStyleType } from '@iot-app-kit/core';

enum ThresholdStyleOptions {
  asLines = 'As lines',
  asFilledRegion = 'As filled region',
  asLinesAndFilledRegion = 'As lines and filled region',
}

export const styledOptions = [
  { label: ThresholdStyleOptions.asLines, value: '1' },
  { label: ThresholdStyleOptions.asFilledRegion, value: '2' },
  { label: ThresholdStyleOptions.asLinesAndFilledRegion, value: '3' },
];

export const convertOptionToThresholdStyle = (
  selectedOption: OptionDefinition
): ThresholdStyleType => {
  switch (selectedOption.label) {
    case ThresholdStyleOptions.asLines: {
      return {
        visible: true,
      };
    }
    case ThresholdStyleOptions.asFilledRegion: {
      return {
        visible: false,
        fill: 'color',
      };
    }
    case ThresholdStyleOptions.asLinesAndFilledRegion: {
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

export const convertThresholdStyleToOption = (
  thresholdStyle: ThresholdStyleType
): OptionDefinition => {
  if (!!thresholdStyle.visible && !thresholdStyle.fill) {
    return styledOptions[0];
  } else if (!thresholdStyle.visible && !!thresholdStyle.fill) {
    return styledOptions[1];
  } else if (!!thresholdStyle.visible && !!thresholdStyle.fill) {
    return styledOptions[2];
  } else {
    return styledOptions[0];
  }
};
