import type { FC } from 'react';

import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Box from '@cloudscape-design/components/box';

import StyleExpandableSection from '../shared/styleExpandableSection/styleExpandableSection';
import { FormLabel } from '../components/styledComponents';

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
          <FormField description='Leave empty to auto calculate.' label='Range'>
            <FormLabel htmlFor='y-axis-min'>Min</FormLabel>
            <Input
              placeholder='Auto'
              controlId='y-axis-min'
              value={`${min ?? ''}`}
              type='number'
              onChange={({ detail }) => onSetRange(updateMin, detail.value)}
              disabled={!visible}
            />

            <FormLabel htmlFor='y-axis-max'>Max</FormLabel>
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
