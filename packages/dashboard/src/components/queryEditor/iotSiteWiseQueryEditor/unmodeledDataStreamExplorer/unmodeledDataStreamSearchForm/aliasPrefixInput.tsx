import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller, type Control } from 'react-hook-form';

export interface AliasPrefixInputProps {
  control: Control<{ aliasPrefix: string }>;
}

export function AliasPrefixInput({ control }: AliasPrefixInputProps) {
  return (
    <Controller
      control={control}
      name='aliasPrefix'
      render={({ field }) => (
        <FormField
          label={
            <span>
              Alias prefix <i>- optional</i>{' '}
            </span>
          }
          description='Enter an alias prefix to filter the list of unmodeled data streams.'
        >
          <Input
            placeholder='Enter an alias prefix'
            value={field.value}
            onChange={({ detail: { value } }) => field.onChange(value)}
          />
        </FormField>
      )}
    />
  );
}
