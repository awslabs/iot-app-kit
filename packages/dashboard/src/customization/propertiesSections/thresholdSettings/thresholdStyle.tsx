import React, { useState } from 'react';
import type { SelectProps } from '@cloudscape-design/components/select';
import Select from '@cloudscape-design/components/select';
import FormField from '@cloudscape-design/components/form-field';

import { OptionDefinition } from '@cloudscape-design/components/internal/components/option/interfaces';
// FIXME: Export ThresholdStyleType from @iot-app-kit/react-components
// eslint-disable-next-line no-restricted-imports
import { ThresholdStyleType } from '@iot-app-kit/react-components/src/components/chart/types';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

export type ThresholdStyleSettingsProps = {
  thresholdStyle: ThresholdStyleType;
  updateAllThresholdStyles: (thresholdStyle: ThresholdStyleType) => void;
};

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

const convertThresholdStyleToOption = (
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

const style = {
  padding: spaceScaledXs,
};

export const ThresholdStyleSettings: React.FC<ThresholdStyleSettingsProps> = ({
  thresholdStyle,
  updateAllThresholdStyles,
}) => {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>(
    convertThresholdStyleToOption(thresholdStyle)
  );

  return (
    <div style={style}>
      <FormField label='Show thresholds'>
        <Select
          onChange={({ detail }) => {
            setSelectedOption(detail.selectedOption);
            const thresholdStyle = convertOptionToThresholdStyle(
              detail.selectedOption
            );
            // Update styles of all thresholds
            updateAllThresholdStyles(thresholdStyle);
          }}
          options={styledOptions}
          selectedOption={selectedOption}
        />
      </FormField>
    </div>
  );
};
