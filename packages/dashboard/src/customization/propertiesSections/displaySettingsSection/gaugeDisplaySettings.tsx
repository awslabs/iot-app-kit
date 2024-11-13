import { Box, Checkbox, FormField } from '@cloudscape-design/components';
import { StyledExpandableSection } from '../components/styledComponents';
import { type PropertyLens } from '~/customization/propertiesSection';
import { type GaugeProperties } from '~/customization/widgets/types';
import { type DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';

export const RenderGaugeDisplaySettingsSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget<GaugeProperties>>;
}) => {
  const [maybeShowName, updateShowName] = useProperty(
    (properties) => properties.showName,
    (properties, updatedShowName) => ({
      ...properties,
      showName: updatedShowName,
    })
  );

  const [maybeShowUnit, updateShowUnit] = useProperty(
    (properties) => properties.showUnit,
    (properties, updatedShowUnit) => ({
      ...properties,
      showUnit: updatedShowUnit,
    })
  );

  const showName = maybeWithDefault(undefined, maybeShowName);
  const showUnit = maybeWithDefault(undefined, maybeShowUnit);

  return (
    <StyledExpandableSection
      className='accordian-header'
      headerText='Display'
      defaultExpanded
      variant='footer'
    >
      <Box padding='s'>
        <FormField label='Display primary values'>
          <Checkbox
            onChange={(event) => updateShowName(event.detail.checked)}
            checked={!!showName}
            data-testid='show-hide-property-name'
          >
            Show property name
          </Checkbox>
          <Checkbox
            onChange={(event) => updateShowUnit(event.detail.checked)}
            checked={!!showUnit}
            data-testid='show-hide-tunit'
          >
            Show units
          </Checkbox>
        </FormField>
      </Box>
    </StyledExpandableSection>
  );
};
