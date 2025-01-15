import { type PropertyLens } from '~/customization/propertiesSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { type CommonChartProperties } from '~/customization/widgets/types';
import { type DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';
import { nonNegative } from '~/util/number';
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
