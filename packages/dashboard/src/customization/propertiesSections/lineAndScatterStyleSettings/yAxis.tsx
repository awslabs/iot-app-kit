import React from 'react';
import type { FC } from 'react';

import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Box from '@cloudscape-design/components/box';

import StyleExpandableSection from '../shared/styleExpandableSection/styleExpandableSection';

type YAxisSectionOptions = {
  visible: boolean;
  min: number | null;
  max: number | null;
  yLabel: string | null;
  setVisible: (visible: boolean) => void;
  updateMin: (min: number | null) => void;
  updateMax: (max: number | null) => void;
  updateYLabel: (yLabel: string | null) => void;
};

export const YAxisSection: FC<YAxisSectionOptions> = ({
  visible,
  min,
  max,
  yLabel,
  setVisible,
  updateMin,
  updateMax,
  updateYLabel,
}) => {
  const onSetRange = (
    updater: (value: number | null) => void,
    value: string
  ) => {
    const parsed = parseInt(value);
    updater(isNaN(parsed) ? null : parsed);
  };

  return (
    <StyleExpandableSection
      header='Y-axis'
      visible={visible}
      setVisible={setVisible}
    >
      <Box padding='s'>
        <Box padding={{ bottom: 'xs' }}>
          <FormField label='Label'>
            <Input
              placeholder='Input Y-axis label'
              value={`${yLabel ?? ''}`}
              type='text'
              onChange={({ detail }) => updateYLabel(detail.value)}
              disabled={!visible}
            />
          </FormField>
        </Box>
        <Box>
          <FormField
            description='Leave empty to auto-calculate based on all the values'
            label='Range'
          >
            <label htmlFor='y-axis-min'>Min</label>
            <Input
              placeholder='Auto'
              controlId='y-axis-min'
              value={`${min ?? ''}`}
              type='number'
              onChange={({ detail }) => onSetRange(updateMin, detail.value)}
              disabled={!visible}
            />

            <label htmlFor='y-axis-max'>Max</label>
            <Input
              placeholder='Auto'
              controlId='y-axis-max'
              value={`${max ?? ''}`}
              type='number'
              onChange={({ detail }) => onSetRange(updateMax, detail.value)}
              disabled={!visible}
            />
          </FormField>
        </Box>
      </Box>
    </StyleExpandableSection>
  );
};
