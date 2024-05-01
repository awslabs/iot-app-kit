import React, { useState } from 'react';
import {
  Checkbox,
  SpaceBetween,
  FormField,
  Input,
  ExpandableSection,
} from '@cloudscape-design/components';

type DataStreamTextBoxProps = {
  name?: string;
  label: string;
  updateName: (newName: string) => void;
};

export const DataStreamLabelComponent = ({
  label,
  updateName,
  name,
}: DataStreamTextBoxProps) => {
  const [value, setValue] = useState(name ?? label);
  const [checked, setChecked] = useState(value === label);

  return (
    <ExpandableSection headerText='Label' disableContentPaddings={true}>
      <FormField label='Label'>
        <SpaceBetween size='xs'>
          <Checkbox
            onChange={({ detail }) => {
              setChecked(detail.checked);
              if (detail.checked) {
                setValue(label);
                updateName(label);
              }
            }}
            checked={checked}
          >
            Use default datastream name
          </Checkbox>
          <Input
            data-testid='label-input'
            onChange={({ detail }) => {
              setValue(detail.value);
              updateName(detail.value);
            }}
            value={value}
            disabled={checked}
          />
        </SpaceBetween>
      </FormField>
    </ExpandableSection>
  );
};
