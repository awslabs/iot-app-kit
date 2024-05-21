import React from 'react';

import {
  Box,
  FormField,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import { PropertyLens } from '~/customization/propertiesSection';
import { GaugeProperties, GaugeWidget } from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { StyledExpandableSection } from '../components/styledComponents';
import { maybeWithDefault } from '~/util/maybe';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';

const widgetWithCustomDisplaySettings: readonly string[] = ['gauge'];

export const isFontsSettingsWidget = (
  widget: DashboardWidget
): widget is GaugeWidget =>
  widgetWithCustomDisplaySettings.some((t) => t === widget.type);

const FontsSection = ({
  controlId,
  fieldLabel,
  value,
  onChange,
}: {
  controlId: string;
  fieldLabel: string;
  value?: number;
  onChange: (value: number) => void;
}) => {
  return (
    <FormField label={fieldLabel}>
      <Input
        controlId={controlId}
        value={`${value ?? ''}`}
        type='number'
        onChange={({ detail }) => onChange(Number(detail.value))}
      />
    </FormField>
  );
};

const RenderFontsSettingsSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget<GaugeProperties>>;
}) => {
  const [maybeFontSize, updateFontSize] = useProperty(
    (properties) => properties.fontSize,
    (properties, updatedFontSize) => ({
      ...properties,
      fontSize: updatedFontSize,
    })
  );

  const [maybeUnitFontSize, updateUnitFontSize] = useProperty(
    (properties) => properties.unitFontSize,
    (properties, updatedUnitFontSize) => ({
      ...properties,
      unitFontSize: updatedUnitFontSize,
    })
  );

  const [maybeLabelFontSize, updateLabelFontSize] = useProperty(
    (properties) => properties.labelFontSize,
    (properties, updatedLabelFontSize) => ({
      ...properties,
      labelFontSize: updatedLabelFontSize,
    })
  );

  const fontSize = maybeWithDefault(undefined, maybeFontSize);
  const unitFontSize = maybeWithDefault(undefined, maybeUnitFontSize);
  const labelFontSize = maybeWithDefault(undefined, maybeLabelFontSize);

  return (
    <StyledExpandableSection
      className='accordian-header'
      headerText='Fonts'
      defaultExpanded
      variant='footer'
    >
      <Box padding='s'>
        <SpaceBetween size='s' direction='vertical'>
          <FontsSection
            controlId='font-size'
            fieldLabel='Font size'
            value={fontSize}
            onChange={updateFontSize}
          />
          <FontsSection
            controlId='unit-font-size'
            fieldLabel='Unit font size'
            value={unitFontSize}
            onChange={updateUnitFontSize}
          />
          <FontsSection
            controlId='label-font-size'
            fieldLabel='Label font size'
            value={labelFontSize}
            onChange={updateLabelFontSize}
          />
        </SpaceBetween>
      </Box>
    </StyledExpandableSection>
  );
};

export const FontsSettings: React.FC = () => (
  <PropertiesSection
    isVisible={isFontsSettingsWidget}
    render={({ useProperty }) => (
      <RenderFontsSettingsSection useProperty={useProperty} />
    )}
  />
);
