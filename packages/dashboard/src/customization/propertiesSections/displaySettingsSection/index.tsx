import {
  Box,
  Checkbox,
  ExpandableSection,
  FormField,
} from '@cloudscape-design/components';
import React from 'react';
import { PropertyLens } from '~/customization/propertiesSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import {
  KPIProperties,
  KPIWidget,
  StatusProperties,
} from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { maybeWithDefault } from '~/util/maybe';

const widgetWithCustomDisplaySettings: readonly string[] = ['kpi', 'status'];

export const isDisplaySettingsWidget = (
  widget: DashboardWidget
): widget is KPIWidget =>
  !!localStorage?.getItem('USE_UPDATED_KPI') &&
  widgetWithCustomDisplaySettings.some((t) => t === widget.type);

const RenderDisplaySettingsSection = ({
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

  const showName = maybeWithDefault(undefined, maybeShowName);
  const showTimestamp = maybeWithDefault(undefined, maybeShowTimestamp);
  const showUnit = maybeWithDefault(undefined, maybeShowUnit);

  return (
    <ExpandableSection
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
          >
            Show name
          </Checkbox>
          <Checkbox
            onChange={(event) => updateShowTimestamp(event.detail.checked)}
            checked={!!showTimestamp}
          >
            Show timestamp
          </Checkbox>
          <Checkbox
            onChange={(event) => updateShowUnit(event.detail.checked)}
            checked={!!showUnit}
          >
            Show unit
          </Checkbox>
        </FormField>
      </Box>
    </ExpandableSection>
  );
};

export const DisplaySettingsSection: React.FC = () => (
  <PropertiesSection
    isVisible={isDisplaySettingsWidget}
    render={({ useProperty }) => (
      <RenderDisplaySettingsSection useProperty={useProperty} />
    )}
  />
);
