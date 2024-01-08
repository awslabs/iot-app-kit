import React from 'react';

import { FormField, Input, InputProps } from '@cloudscape-design/components';

export type LabeledInputProps = InputProps & { label: string };

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  ...inputProps
}) => (
  <FormField label={label}>
    <Input {...inputProps} />
  </FormField>
);

export default LabeledInput;
