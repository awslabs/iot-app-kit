import { Box, Button, Header, SpaceBetween } from '@cloudscape-design/components';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Toggle from '@cloudscape-design/components/toggle';
import type { FC } from 'react';
import React from 'react';
import { useExpandable } from '../shared/useExpandable';

import './legendSection.css'

type LegendSectionOptions = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const LegendSection: FC<LegendSectionOptions> = ({
  visible,
  setVisible,
}) => {
  return (
    <div className='legend-section-container'>
      <Box variant='span' fontSize='heading-s' fontWeight='bold'>
        Legend
      </Box>
      <Toggle
        onChange={(e) => {
          setVisible(e.detail.checked)
        }
        }
        checked={visible}
      >
        View on chart
      </Toggle>
    </div>
  );
};
