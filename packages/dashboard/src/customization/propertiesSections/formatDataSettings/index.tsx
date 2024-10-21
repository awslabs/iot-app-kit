import React from 'react';

import { PropertyLens } from '~/customization/propertiesSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { CommonChartProperties } from '~/customization/widgets/types';
import { maybeWithDefault } from '~/helpers/maybe';
import { nonNegative } from '~/helpers/number';
import { DashboardWidget } from '~/types';
import { DecimalPlacesSection } from './section';

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
export const FormatDataConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isSettingsWidget}
    render={({ useProperty }) => (
      <RenderDecimalPlacesConfiguration useProperty={useProperty} />
    )}
  />
);
