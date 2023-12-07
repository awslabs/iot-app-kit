import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import type { FC } from 'react';
import React from 'react';
import StyleExpandableSection from '../shared/styleExpandableSection/styleExpandableSection';
import Box from '@cloudscape-design/components/box';

type YAxisSectionOptions = {
  visible: boolean;
  min: number | null;
  max: number | null;
  setVisible: (visible: boolean) => void;
  updateMin: (min: number | null) => void;
  updateMax: (max: number | null) => void;
};

export const YAxisSection: FC<YAxisSectionOptions> = ({ visible, min, max, setVisible, updateMin, updateMax }) => {
  const onSetRange = (updater: (value: number | null) => void, value: string) => {
    const parsed = parseInt(value);
    updater(isNaN(parsed) ? null : parsed);
  };

  return (
    <StyleExpandableSection header='Y-axis' visible={visible} setVisible={setVisible}>
      <Box padding='s'>
        <FormField description='Leave empty to auto-calculate based on all the values' label='Range'>
          <label htmlFor='y-axis-min'>Min</label>
          <Input
            placeholder='Auto'
            controlId='y-axis-min'
            value={`${min ?? ''}`}
            type='number'
            onChange={({ detail }) => onSetRange(updateMin, detail.value)}
          />

          <label htmlFor='y-axis-max'>Max</label>
          <Input
            placeholder='Auto'
            controlId='y-axis-max'
            value={`${max ?? ''}`}
            type='number'
            onChange={({ detail }) => onSetRange(updateMax, detail.value)}
          />
        </FormField>
      </Box>
    </StyleExpandableSection>
  );
};
