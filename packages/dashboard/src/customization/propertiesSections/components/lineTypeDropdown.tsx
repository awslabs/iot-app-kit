import type { FC } from 'react';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import { dropdownConsts } from '../constants';

type TypeSectionOptions = {
  disabled?: boolean;
  type: string | undefined;
  updateType: (type: string) => void;
};

const dropdownData = dropdownConsts.lineType;

export const LineTypeSection: FC<TypeSectionOptions> = ({
  disabled = false,
  type,
  updateType,
}) => {
  return (
    <FormField label='Line type'>
      <Select
        disabled={disabled}
        selectedOption={
          dropdownData.lineTypeOptions.find(({ value }) => value === type) ??
          null
        }
        onChange={({ detail }) =>
          updateType(
            detail.selectedOption.value ?? dropdownData.defaultValue.value
          )
        }
        options={dropdownData.lineTypeOptions}
      />
    </FormField>
  );
};
