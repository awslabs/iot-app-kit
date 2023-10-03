import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';
import { SettingsSection } from './section';
import { CommonChartProperties } from '~/customization/widgets/types';
import { nonNegative } from '~/util/number';

const isSettingsWidget = (w: DashboardWidget): w is DashboardWidget<CommonChartProperties> =>
  'queryConfig' in w.properties && w.type !== 'line-scatter-chart';

export const SettingsConfiguration: React.FC = () => (
  <PropertiesSection
    isVisible={isSettingsWidget}
    render={({ useProperty }) => {
      const [significantDigits, updateSignificantDigits] = useProperty(
        (properties) => properties.significantDigits,
        (properties, updatedSignificantDigits) => ({
          ...properties,
          significantDigits: updatedSignificantDigits && nonNegative(updatedSignificantDigits),
        })
      );

      return (
        <SettingsSection
          significantDigits={maybeWithDefault(undefined, significantDigits)}
          updateSignificantDigits={updateSignificantDigits}
        />
      );
    }}
  />
);
