import type { FC } from 'react';
import React from 'react';
import './legendSection.css';
import StyleExpandableSection from '../shared/styleExpandableSection/styleExpandableSection';
import { AlignmentDropdown } from '../components/alignmentDropdown';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

type LegendSectionOptions = {
  disabled?: boolean;
  visible?: boolean;
  position?: string;
  setVisible: (visible: boolean) => void;
  setAlignment: (position: string) => void;
};

export const LegendSection: FC<LegendSectionOptions> = ({
  visible,
  position,
  setVisible,
  setAlignment,
}) => {
  const handleType = (position: string) => {
    setAlignment(position);
  };

  return (
    <StyleExpandableSection
      header='Legend'
      visible={visible}
      setVisible={setVisible}
    >
      <Box padding='s'>
        <SpaceBetween size='m'>
          <AlignmentDropdown
            position={position}
            onTypeChange={handleType}
            disabled={!visible}
          />
        </SpaceBetween>
      </Box>
    </StyleExpandableSection>
  );
};
