import { Box } from '@cloudscape-design/components';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Toggle from '@cloudscape-design/components/toggle';
import type { FC } from 'react';
import React from 'react';
import { useExpandable } from '../shared/useExpandable';
import './lineAndScatterStyleSettings.css';

type YAxisSectionOptions = {
  visible: boolean;
  min: number | null;
  max: number | null;
  setVisible: (visible: boolean) => void;
  updateMin: (min: number | null) => void;
  updateMax: (max: number | null) => void;
};

const YAxisToggle = ({ visible, setVisible }: Pick<YAxisSectionOptions, 'visible' | 'setVisible'>) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
  >
    <Toggle
      onChange={(e) => {
        setVisible(e.detail.checked);
      }}
      checked={visible}
    >
      View on chart
    </Toggle>
  </div>
);

export const YAxisSection: FC<YAxisSectionOptions> = ({ visible, min, max, setVisible, updateMin, updateMax }) => {
  const [expanded, setExpanded] = useExpandable(true);

  const onSetRange = (updater: (value: number | null) => void, value: string) => {
    const parsed = parseInt(value);
    updater(isNaN(parsed) ? null : parsed);
  };

  return (
    <ExpandableSection
      className='accordian-header accordian-custom-header'
      expanded={expanded}
      onChange={(e) => setExpanded(e.detail.expanded)}
      headerText={
        <div className='yaxis-header'>
          <div onClick={() => setExpanded(!expanded)}>Y-axis</div>
          <YAxisToggle setVisible={setVisible} visible={visible} />
        </div>
      }
      variant='footer'
    >
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
    </ExpandableSection>
  );
};
