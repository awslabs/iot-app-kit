import React, { useCallback, useContext } from 'react';
import { Checkbox, FormField, Input, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl, defineMessages } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { IModelRefComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../sceneComposerIdContext';
import { DistanceUnits } from '../../../interfaces';
import { NumericInput } from '../CommonPanelComponents';
import { parseFloatOrDefault } from '../../../utils/mathUtils';

const NONE_UOM_VALUE = 'none';
const NONE_UOM_LABEL = 'None';
const CUSTOM_UOM_VALUE = 'custom';
const CUSTOM_UOM_LABEL = 'Custom Scale';

export const ModelRefComponentEditor: React.FC<IComponentEditorProps> = ({
  node,
  component,
}: IComponentEditorProps) => {
  const modelRefComponent = component as IModelRefComponentInternal;
  const intl = useIntl();

  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const isCustomUoM = !!modelRefComponent.localScale;

  const onUpdateCallback = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );
  const i18nDistanceUnitstrings = defineMessages({
    None: {
      defaultMessage: 'None',
      description: 'Distance Units in a dropdown menu',
    },
    'Custom Scale': {
      defaultMessage: 'Custom Scale',
      description: 'Distance Units in a dropdown menu',
    },
    millimeters: {
      defaultMessage: 'millimeters',
      description: 'Distance Units in a dropdown menu',
    },
    centimeters: {
      defaultMessage: 'centimeters',
      description: 'Distance Units in a dropdown menu',
    },
    decimeters: {
      defaultMessage: 'decimeters',
      description: 'Distance Units in a dropdown menu',
    },
    meters: {
      defaultMessage: 'meters',
      description: 'Distance Units in a dropdown menu',
    },
    kilometers: {
      defaultMessage: 'kilometers',
      description: 'Distance Units in a dropdown menu',
    },
    inches: {
      defaultMessage: 'inches',
      description: 'Distance Units in a dropdown menu',
    },
    feet: {
      defaultMessage: 'feet',
      description: 'Distance Units in a dropdown menu',
    },
    yards: {
      defaultMessage: 'yards',
      description: 'Distance Units in a dropdown menu',
    },
    miles: {
      defaultMessage: 'miles',
      description: 'Distance Units in a dropdown menu',
    },
  });

  const distanceUnitsOptions = [
    { label: intl.formatMessage(i18nDistanceUnitstrings[NONE_UOM_LABEL]), value: NONE_UOM_VALUE },
    { label: intl.formatMessage(i18nDistanceUnitstrings[CUSTOM_UOM_LABEL]), value: CUSTOM_UOM_VALUE },
    ...Object.keys(DistanceUnits).map((d) => ({
      label: intl.formatMessage(i18nDistanceUnitstrings[d]) || d,
      value: d,
    })),
  ];

  return (
    <SpaceBetween size='s'>
      <FormField label={intl.formatMessage({ defaultMessage: 'Model Type', description: 'Form Field label' })}>
        <Input value={modelRefComponent.modelType} disabled />
      </FormField>

      <FormField label={intl.formatMessage({ defaultMessage: 'Model Path', description: 'Form Field label' })}>
        <Input value={modelRefComponent.uri} disabled />
      </FormField>

      <FormField label={intl.formatMessage({ defaultMessage: 'Shadow Settings', description: 'Form Field label' })}>
        <Checkbox
          data-testid={'cast-shadow-checkbox'}
          onChange={(event) => {
            onUpdateCallback({ castShadow: event.detail.checked });
          }}
          checked={modelRefComponent.castShadow ?? false}
        >
          {intl.formatMessage({ defaultMessage: 'Cast Shadow', description: 'select box option text value' })}
        </Checkbox>
        <Checkbox
          data-testid={'receive-shadow-checkbox'}
          onChange={(event) => {
            onUpdateCallback({ receiveShadow: event.detail.checked });
          }}
          checked={modelRefComponent.receiveShadow ?? false}
        >
          {intl.formatMessage({ defaultMessage: 'Receive Shadow', description: 'select box option text value' })}
        </Checkbox>
      </FormField>

      <FormField label={intl.formatMessage({ defaultMessage: 'Unit of Measure', description: 'Form Field label' })}>
        <Select
          selectedOption={
            isCustomUoM
              ? { label: intl.formatMessage(i18nDistanceUnitstrings[CUSTOM_UOM_LABEL]), value: CUSTOM_UOM_VALUE }
              : modelRefComponent.unitOfMeasure
              ? {
                  label:
                    intl.formatMessage(i18nDistanceUnitstrings[modelRefComponent.unitOfMeasure as string]) ||
                    (modelRefComponent.unitOfMeasure as string),
                  value: modelRefComponent.unitOfMeasure as string,
                }
              : null
          }
          onChange={({ detail }) => {
            if (detail.selectedOption.value === CUSTOM_UOM_VALUE) {
              onUpdateCallback({ unitOfMeasure: undefined, localScale: [1, 1, 1] });
            } else if (detail.selectedOption.value === NONE_UOM_VALUE) {
              onUpdateCallback({ unitOfMeasure: undefined, localScale: undefined });
            } else {
              onUpdateCallback({ unitOfMeasure: detail.selectedOption.value, localScale: undefined });
            }
          }}
          options={distanceUnitsOptions}
          selectedAriaLabel={intl.formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience.',
          })}
          placeholder={intl.formatMessage({ defaultMessage: 'Choose an option', description: 'placeholder' })}
        />
      </FormField>

      {isCustomUoM && (
        <NumericInput
          data-testid={'local-scale-numeric-input'}
          value={modelRefComponent.localScale![0]}
          setValue={(val) => {
            onUpdateCallback({ localScale: [val, val, val] });
          }}
          toStr={(val) => val.toFixed(2)}
          fromStr={(str) => parseFloatOrDefault(str, 1)}
        />
      )}
    </SpaceBetween>
  );
};
