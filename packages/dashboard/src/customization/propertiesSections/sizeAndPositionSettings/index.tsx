import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { SizeAndPositionSection } from './section';
import { DashboardWidget, Rect } from '~/types';

const isNotLineScatterWidget = (widget: DashboardWidget): widget is DashboardWidget => widget.type !== 'xy-plot';

const RenderSizeAndPositionConfiguration = ({
  useSize,
  usePosition,
}: {
  useSize: () => [Pick<Rect, 'height' | 'width'>, (vector: Pick<Rect, 'x' | 'y'>) => void];
  usePosition: () => [Pick<Rect, 'x' | 'y'>, (vector: Pick<Rect, 'x' | 'y'>) => void];
}) => {
  const [size, updateSize] = useSize();
  const [position, updatePosition] = usePosition();
  return <SizeAndPositionSection {...{ size, updateSize, position, updatePosition }} />;
};

export const SizeAndPositionConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isNotLineScatterWidget}
    render={({ useSize, usePosition }) => (
      <RenderSizeAndPositionConfiguration useSize={useSize} usePosition={usePosition} />
    )}
  />
);
