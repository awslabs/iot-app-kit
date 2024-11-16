import { useState } from 'react';
import {
  Checkbox,
  SpaceBetween,
  FormField,
  Input,
  ExpandableSection,
} from '@cloudscape-design/components';
import { type PropertySummary } from '~/hooks/useAssetDescriptionQueries';

type DataStreamTextBoxProps = {
  name?: string;

  propertyName: NonNullable<PropertySummary['name']>;
  updateName: (newName: string) => void;
};

export const DataStreamLabelComponent = ({
  updateName,
  name,
  propertyName,
}: DataStreamTextBoxProps) => {
  const [value, setValue] = useState(name ?? propertyName);
  const [checked, setChecked] = useState(value === propertyName);

  return (
    <ExpandableSection headerText='Label' disableContentPaddings={true}>
      <FormField label='Label'>
        <SpaceBetween size='xs'>
          <Checkbox
            onChange={({ detail }) => {
              setChecked(detail.checked);
              if (detail.checked) {
                setValue(propertyName);
                updateName(propertyName);
              }
            }}
            checked={checked}
          >
            Use default data stream name
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
