import { Box, Checkbox, FormField } from '@cloudscape-design/components';
import { StyledExpandableSection } from '../components/styledComponents';
import { type PropertyLens } from '../../../customization/propertiesSection';
import {
  type KPIProperties,
  type StatusProperties,
} from '../../../customization/widgets/types';
import { type DashboardWidget } from '../../../types';
import { maybeWithDefault } from '../../../util/maybe';

export const RenderDisplaySettingsSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget<KPIProperties | StatusProperties>>;
}) => {
  const [maybeShowName, updateShowName] = useProperty(
    (properties) => properties.showName,
    (properties, updatedShowName) => ({
      ...properties,
      showName: updatedShowName,
    })
  );

  const [maybeShowTimestamp, updateShowTimestamp] = useProperty(
    (properties) => properties.showTimestamp,
    (properties, updatedShowTimestamp) => ({
      ...properties,
      showTimestamp: updatedShowTimestamp,
    })
  );

  const [maybeShowUnit, updateShowUnit] = useProperty(
    (properties) => properties.showUnit,
    (properties, updatedShowUnit) => ({
      ...properties,
      showUnit: updatedShowUnit,
    })
  );

  const [
    maybeShowAggregationAndResolution,
    updateShowAggregationAndResolution,
  ] = useProperty(
    (properties) => properties.showAggregationAndResolution,
    (properties, updatedValue) => ({
      ...properties,
      showAggregationAndResolution: updatedValue,
    })
  );

  const [maybeShowDataQuality, updateShowDataQuality] = useProperty(
    (properties) => properties.showDataQuality,
    (properties, updatedShowDataQuality) => ({
      ...properties,
      showDataQuality: updatedShowDataQuality,
    })
  );

  const showName = maybeWithDefault(undefined, maybeShowName);
  const showTimestamp = maybeWithDefault(undefined, maybeShowTimestamp);
  const showUnit = maybeWithDefault(undefined, maybeShowUnit);
  const showAggregationAndResolution = maybeWithDefault(
    undefined,
    maybeShowAggregationAndResolution
  );
  const showDataQuality = maybeWithDefault(undefined, maybeShowDataQuality);

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
            data-testid='show-hide-name'
          >
            Show name
          </Checkbox>
          <Checkbox
            onChange={(event) => updateShowTimestamp(event.detail.checked)}
            checked={!!showTimestamp}
            data-testid='show-hide-timestamp'
          >
            Show timestamp
          </Checkbox>
          <Checkbox
            onChange={(event) => updateShowUnit(event.detail.checked)}
            checked={!!showUnit}
            data-testid='show-hide-unit'
          >
            Show unit
          </Checkbox>
          <Checkbox
            onChange={(event) =>
              updateShowAggregationAndResolution(event.detail.checked)
            }
            checked={!!showAggregationAndResolution}
            data-testid='show-hide-aggregation-resolution'
          >
            Show aggregation & resolution
          </Checkbox>
          <Checkbox
            onChange={(event) => updateShowDataQuality(event.detail.checked)}
            checked={!!showDataQuality}
            data-testid='show-hide-data-quality'
          >
            Show data quality
          </Checkbox>
        </FormField>
      </Box>
    </StyledExpandableSection>
  );
};
