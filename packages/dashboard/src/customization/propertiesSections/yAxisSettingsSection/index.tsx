import React from 'react';

import { PropertyLens } from '~/customization/propertiesSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { GaugeProperties, GaugeWidget } from '~/customization/widgets/types';
import { maybeWithDefault } from '~/helpers/maybe';
import { DashboardWidget } from '~/types';
import { YAxisSection } from '../yAxisSettings';

const widgetWithCustomFontsSettings: readonly string[] = ['gauge'];

export const isGaugeWidget = (widget: DashboardWidget): widget is GaugeWidget =>
  widgetWithCustomFontsSettings.some((t) => t === widget.type);

const RenderYAxisSettingSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget<GaugeProperties>>;
}) => {
  const [maybeYMin, updateYMin] = useProperty(
    (properties) => properties.yMin,
    (properties, updatedYMin) => ({
      ...properties,
      yMin: updatedYMin,
    })
  );

  const [maybeYMax, updateYMax] = useProperty(
    (properties) => properties.yMax,
    (properties, updatedYMax) => ({
      ...properties,
      yMax: updatedYMax,
    })
  );

  const min = maybeWithDefault(undefined, maybeYMin);
  const max = maybeWithDefault(undefined, maybeYMax);

  const handleUpdateMin = (min: number | null) => {
    updateYMin(min ?? 0);
  };

  const handleUpdateMax = (max: number | null) => {
    updateYMax(max ?? 100);
  };

  return (
    <YAxisSection
      min={min ?? null}
      max={max ?? null}
      showYLabel={false}
      showToggle={false}
      updateMin={handleUpdateMin}
      updateMax={handleUpdateMax}
    />
  );
};

export const YAxisSettingSection: React.FC = () => (
  <PropertiesSection
    isVisible={isGaugeWidget}
    render={({ useProperty }) => (
      <RenderYAxisSettingSection useProperty={useProperty} />
    )}
  />
);
