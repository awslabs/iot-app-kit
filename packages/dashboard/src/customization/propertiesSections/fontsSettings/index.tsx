import React, { useEffect } from 'react';

import {
  Box,
  FormField,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import { Controller, useForm } from 'react-hook-form';
import {
  FilterPredicate,
  PropertyLens,
  useSelection,
} from '~/customization/propertiesSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { GaugeProperties, GaugeWidget } from '~/customization/widgets/types';
import { maybeWithDefault } from '~/helpers/maybe';
import { DashboardWidget } from '~/types';
import { StyledExpandableSection } from '../components/styledComponents';

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
  shouldClearErrors,
}: {
  controlId: string;
  fieldLabel: string;
  value?: number;
  onChange: (value: number) => void;
  shouldClearErrors: boolean | string;
}) => {
  const { control, setValue, clearErrors } = useForm<{
    fontSize: string | undefined;
  }>({
    mode: 'onChange',
  });

  useEffect(() => {
    //controller is using mode: 'onChange', it's not revalidating when different widget is selected
    //when user selects different widget, manually set the fontSize and clear the error state
    setValue('fontSize', value?.toFixed());
    clearErrors();
  }, [clearErrors, setValue, value, shouldClearErrors]);

  return (
    <Controller
      control={control}
      name='fontSize'
      rules={{
        min: {
          value: 1,
          message: 'Font size must be greater than 0',
        },
      }}
      render={({ field, fieldState }) => (
        <FormField label={fieldLabel} errorText={fieldState.error?.message}>
          <Input
            controlId={controlId}
            value={field.value || ''}
            type='number'
            onChange={({ detail: { value } }) => {
              field.onChange(value);
              onChange(Number(value));
            }}
          />
        </FormField>
      )}
    />
  );
};

const RenderFontsSettingsSection = ({
  useProperty,
  isVisible,
}: {
  useProperty: PropertyLens<DashboardWidget<GaugeProperties>>;
  isVisible: FilterPredicate<GaugeWidget>;
}) => {
  const compositeSelection = useSelection({ filter: isVisible });
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
            shouldClearErrors={!!compositeSelection}
          />
          <FontsSection
            controlId='unit-font-size'
            fieldLabel='Unit font size'
            value={unitFontSize}
            onChange={updateUnitFontSize}
            shouldClearErrors={!!compositeSelection}
          />
          <FontsSection
            controlId='label-font-size'
            fieldLabel='Label font size'
            value={labelFontSize}
            onChange={updateLabelFontSize}
            shouldClearErrors={!!compositeSelection}
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
      <RenderFontsSettingsSection
        useProperty={useProperty}
        isVisible={isFontsSettingsWidget}
      />
    )}
  />
);
