import React from 'react';
import { ExpandableSection } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';

const ThresholdsSection = () => {
  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader text="Thresholds" onClickButton={() => {}} />}
      defaultExpanded
    >
      --
    </ExpandableSection>
  );
};

export default ThresholdsSection;
