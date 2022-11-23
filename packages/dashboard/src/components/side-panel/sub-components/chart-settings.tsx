import React from 'react';
import { ExpandableSection } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';

const ChartSettings = () => {
  return (
    <ExpandableSection headerText={<ExpandableSectionHeader>Chart Setting</ExpandableSectionHeader>} defaultExpanded>
      --
    </ExpandableSection>
  );
};

export default ChartSettings;
