import type { FC } from 'react';
import React from 'react';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Box from '@cloudscape-design/components/box';
import './lineAndScatterStyleSettings.css';
import { spaceStaticXxs } from '@cloudscape-design/design-tokens';

type TitleSectionOptions = {
  title: string | undefined;
  updateTitle: (title: string) => void;
};

const titlePadding = {
  paddingTop: spaceStaticXxs,
};

export const TitleSection: FC<TitleSectionOptions> = ({ title, updateTitle }) => {
  return (
    <Box padding='s'>
      <FormField label='Widget title'>
        <div style={titlePadding}>
          <Input placeholder='Input title' onChange={({ detail }) => updateTitle(detail.value)} value={title ?? ''} />
        </div>
      </FormField>
    </Box>
  );
};
