import type { FC } from 'react';
import './legendSection.css';
import StyleExpandableSection from '../shared/styleExpandableSection/styleExpandableSection';
import { AlignmentDropdown } from '../components/alignmentDropdown';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { type ChartLegend } from '~/customization/widgets/types';
import { LegendDisplaySection } from '../components/legendDisplaySection';

type LegendSectionOptions = {
  disabled?: boolean;
  visible?: boolean;
  position?: string;
  visibleContent?: ChartLegend['visibleContent'];
  setVisible: (visible: boolean) => void;
  setAlignment: (position: string) => void;
  setVisibleContent: (visibleContent: ChartLegend['visibleContent']) => void;
};

export const LegendSection: FC<LegendSectionOptions> = ({
  visible,
  position,
  visibleContent,
  setVisible,
  setAlignment,
  setVisibleContent,
}) => {
  const handleType = (position: string) => {
    setAlignment(position);
  };
  const handleVisibleChange = (
    visibleContent: ChartLegend['visibleContent']
  ) => {
    setVisibleContent(visibleContent);
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
          <LegendDisplaySection
            visibleContent={visibleContent}
            onChange={handleVisibleChange}
            disabled={!visible}
          />
        </SpaceBetween>
      </Box>
    </StyleExpandableSection>
  );
};
