import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { isDashboardWidget } from '~/customization/propertiesSection';
import { SizeAndPositionSection } from './section';

export const SizeAndPositionConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isDashboardWidget}
    render={({ useSize, usePosition }) => {
      const [size, updateSize] = useSize();
      const [position, updatePosition] = usePosition();
      return <SizeAndPositionSection {...{ size, updateSize, position, updatePosition }} />;
    }}
  />
);
