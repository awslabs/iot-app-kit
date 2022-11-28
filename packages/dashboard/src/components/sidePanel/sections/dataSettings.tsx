import React from 'react';
import { ExpandableSection } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';

const DataSettings = () => {
  return (
    <ExpandableSection headerText={<ExpandableSectionHeader>Data Settings</ExpandableSectionHeader>} defaultExpanded>
      --
    </ExpandableSection>
  );
};

export default DataSettings;
