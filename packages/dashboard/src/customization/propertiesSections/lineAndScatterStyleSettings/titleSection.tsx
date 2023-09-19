import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import type { FC } from 'react';
import React from 'react';

type TitleSectionOptions = {
  title: string | undefined;
  updateTitle: (title: string) => void;
};

export const TitleSection: FC<TitleSectionOptions> = ({ title, updateTitle }) => {
  return (
    <ExpandableSection headerText='Title' defaultExpanded>
      <FormField label='Name'>
        <Input onChange={({ detail }) => updateTitle(detail.value)} value={title ?? ''} />
      </FormField>
    </ExpandableSection>
  );
};
