import { Box } from '@cloudscape-design/components';
import Toggle from '@cloudscape-design/components/toggle';
import type { FC } from 'react';
import React from 'react';

import './legendSection.css';

type LegendSectionOptions = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const LegendSection: FC<LegendSectionOptions> = ({ visible, setVisible }) => {
  return (
    <div className='legend-section-container'>
      <Box variant='span' fontSize='heading-s' fontWeight='bold'>
        Legend
      </Box>
      <Toggle
        onChange={(e) => {
          setVisible(e.detail.checked);
        }}
        checked={visible}
      >
        View on chart
      </Toggle>
    </div>
  );
};
