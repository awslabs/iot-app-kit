import React from 'react';

import FormField from '@cloudscape-design/components/form-field';
import Input, { InputProps } from '@cloudscape-design/components/input';

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
