import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller, type Control } from 'react-hook-form';
import { type SearchFields } from './types';

export interface SearchQueryInputProps {
  control: Control<SearchFields>;
  disabled?: boolean;
}

export const SearchQueryInput = ({
  control,
  disabled,
}: SearchQueryInputProps) => {
  const MIN_SEARCH_QUERY_LENGTH = 1;
  const MAX_SEARCH_QUERY_LENGTH = 48;

  return (
    <Controller
      control={control}
      name='searchQuery'
      rules={{
        required: 'Search query must be between 1 and 48 characters.',
        minLength: {
          value: MIN_SEARCH_QUERY_LENGTH,
          message: 'Search query is too short.',
        },
        maxLength: {
          value: MAX_SEARCH_QUERY_LENGTH,
          message: 'Search query is too long.',
        },
      }}
      render={({ field, fieldState }) => (
        <FormField
          label='Search query'
          description='Enter a query using character string or wildcard character % to search the data.'
          errorText={fieldState.error?.message}
          constraintText={`Must be between ${MIN_SEARCH_QUERY_LENGTH} and ${MAX_SEARCH_QUERY_LENGTH} characters.`}
        >
          <Input
            disabled={disabled}
            placeholder='Enter a search query'
            value={field.value}
            onChange={({ detail: { value } }) => field.onChange(value)}
          />
        </FormField>
      )}
    />
  );
};
