import React from 'react';
import { ExpandableSection } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';

const ThresholdsSection = () => {
  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader onClickButton={() => {}}>Thresholds</ExpandableSectionHeader>}
      defaultExpanded
    >
      --
    </ExpandableSection>
  );
};

export default ThresholdsSection;
