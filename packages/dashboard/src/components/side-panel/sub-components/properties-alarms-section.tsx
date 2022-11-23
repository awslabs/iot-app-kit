import React from 'react';
import { ExpandableSection } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';

const PropertiesAlarmsSection = () => {
  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader text="Properties & Alarms" onClickButton={() => {}} />}
      defaultExpanded
    >
      --
    </ExpandableSection>
  );
};

export default PropertiesAlarmsSection;
