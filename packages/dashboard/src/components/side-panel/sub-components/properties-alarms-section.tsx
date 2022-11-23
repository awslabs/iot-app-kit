import React from 'react';
import { ExpandableSection } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';

const PropertiesAlarmsSection = () => {
  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader onClickButton={() => {}}>Properties & Alarms</ExpandableSectionHeader>}
      defaultExpanded
    >
      --
    </ExpandableSection>
  );
};

export default PropertiesAlarmsSection;
