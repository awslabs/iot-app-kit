import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { SearchFields } from './types';

export interface SearchQueryInputProps {
  control: Control<SearchFields>;
}

export function SearchQueryInput({ control }: SearchQueryInputProps) {
  const MIN_SEARCH_QUERY_LENGTH = 1;
  const MAX_SEARCH_QUERY_LENGTH = 18;

  return (
    <Controller
      control={control}
      name='searchQuery'
      rules={{
        required: 'Search query is required.',
        minLength: { value: MIN_SEARCH_QUERY_LENGTH, message: 'Search query is too short.' },
        maxLength: { value: MAX_SEARCH_QUERY_LENGTH, message: 'Search query is too long.' },
      }}
      render={({ field, fieldState }) => (
        <FormField
          label='Search query'
          description='Enter a query to search for modeled data streams.'
          errorText={fieldState.error?.message}
          constraintText={`Must be between ${MIN_SEARCH_QUERY_LENGTH} and ${MAX_SEARCH_QUERY_LENGTH} characters.`}
        >
          <Input
            placeholder='Enter a search query'
            value={field.value}
            onChange={({ detail: { value } }) => field.onChange(value)}
          />
        </FormField>
      )}
    />
  );
}
