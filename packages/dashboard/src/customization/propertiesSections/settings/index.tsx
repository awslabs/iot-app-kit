import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';
import { SettingsSection } from './section';
import { CommonChartProperties } from '~/customization/widgets/types';
import { nonNegative } from '~/util/number';
import { PropertyLens } from '~/customization/propertiesSection';

const isSettingsWidget = (
  w: DashboardWidget
): w is DashboardWidget<CommonChartProperties> =>
  'queryConfig' in w.properties && w.type !== 'xy-plot';

const RenderSettingsConfiguration = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget<CommonChartProperties>>;
}) => {
  const [significantDigits, updateSignificantDigits] = useProperty(
    (properties) => properties.significantDigits,
    (properties, updatedSignificantDigits) => ({
      ...properties,
      significantDigits:
        updatedSignificantDigits && nonNegative(updatedSignificantDigits),
    })
  );

  return (
    <SettingsSection
      significantDigits={maybeWithDefault(undefined, significantDigits)}
      updateSignificantDigits={updateSignificantDigits}
    />
  );
};
export const SettingsConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isSettingsWidget}
    render={({ useProperty }) => (
      <RenderSettingsConfiguration useProperty={useProperty} />
    )}
  />
);
