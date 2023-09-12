import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { SizeAndPositionSection } from './section';
import { DashboardWidget } from '~/types';

const isNotLineScatterWidget = (widget: DashboardWidget): widget is DashboardWidget => widget.type !== 'line-scatter-chart';

export const SizeAndPositionConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isNotLineScatterWidget}
    render={({ useSize, usePosition }) => {
      const [size, updateSize] = useSize();
      const [position, updatePosition] = usePosition();
      return <SizeAndPositionSection {...{ size, updateSize, position, updatePosition }} />;
    }}
  />
);
