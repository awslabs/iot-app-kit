import { Box, Header, SpaceBetween } from '@cloudscape-design/components';
import React from 'react';
import { useSelection } from '~/customization/propertiesSection';

import './index.css';

type SidePanelProps = {
  sections: React.ReactElement[];
};

const SidePanel = ({ sections }: SidePanelProps) => {
  const selection = useSelection();

  if (!selection) {
    return (
      <div className='side-panel-empty'>
        <Box margin='m' variant='p' color='text-status-inactive'>
          Select widgets to configure.
        </Box>
      </div>
    );
  }

  return (
    <Box padding={{ horizontal: 'm', vertical: 'l' }}>
      <Header variant='h3'>Configuration</Header>
      <SpaceBetween size='xs' direction='vertical'>
        {sections}
      </SpaceBetween>
    </Box>
  );
};

export default SidePanel;
