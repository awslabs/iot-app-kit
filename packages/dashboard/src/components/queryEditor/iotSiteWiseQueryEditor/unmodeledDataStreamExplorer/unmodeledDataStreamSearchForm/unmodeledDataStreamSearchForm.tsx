import Button from '@cloudscape-design/components/button';
import Form from '@cloudscape-design/components/form';
import React from 'react';
import { useForm } from 'react-hook-form';

import { AliasPrefixInput } from './aliasPrefixInput';

interface UnmodeledDataStreamSearchFormProps {
  onSearch: (aliasPrefix: string | undefined) => void;
}

export function UnmodeledDataStreamSearchForm({
  onSearch,
}: UnmodeledDataStreamSearchFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: { aliasPrefix: '' },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        void handleSubmit((formData) => {
          onSearch(formData.aliasPrefix);
        })();
      }}
    >
      <Form
        actions={
          <Button iconName='search' variant='primary'>
            Search
          </Button>
        }
      >
        <AliasPrefixInput control={control} />
      </Form>
    </form>
  );
}
