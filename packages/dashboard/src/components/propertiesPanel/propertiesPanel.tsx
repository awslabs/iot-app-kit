import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React, { type ReactElement } from 'react';

import { PropertiesPanelEmpty } from './propertyPanelsEmpty';
import { useSelection } from '~/customization/propertiesSection';

export interface PropertiesPanelProps {
  sections: ReactElement[];
}

/** Panel element responsible for rendering chart configuration sections. */
export function PropertiesPanel({ sections }: PropertiesPanelProps) {
  const selection = useSelection();

  if (selection == null) {
    return <PropertiesPanelEmpty />;
  }

  return (
    <Box padding={{ horizontal: 'm', vertical: 'l' }}>
      <Header variant='h3'>Configuration</Header>

      <SpaceBetween size='xs' direction='vertical'>
        {sections}
      </SpaceBetween>
    </Box>
  );
}
