import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';
import { DecimalPlacesSection } from './section';
import { CommonChartProperties } from '~/customization/widgets/types';
import { nonNegative } from '~/util/number';
import { PropertyLens } from '~/customization/propertiesSection';

const isSettingsWidget = (
  w: DashboardWidget
): w is DashboardWidget<CommonChartProperties> => 'queryConfig' in w.properties;

const RenderDecimalPlacesConfiguration = ({
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
    <DecimalPlacesSection
      significantDigits={maybeWithDefault(undefined, significantDigits)}
      updateSignificantDigits={updateSignificantDigits}
    />
  );
};
export const DecimalPlacesConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isSettingsWidget}
    render={({ useProperty }) => (
      <RenderDecimalPlacesConfiguration useProperty={useProperty} />
    )}
  />
);
