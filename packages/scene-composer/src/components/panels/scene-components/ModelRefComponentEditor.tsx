import React, { useCallback, useMemo } from 'react';
import { Checkbox, FormField, Input, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl, defineMessages } from 'react-intl';

import { IComponentEditorProps } from '../ComponentEditor';
import { IModelRefComponentInternal, ISceneComponentInternal, useStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { DistanceUnits } from '../../../interfaces';
import { NumericInput } from '../CommonPanelComponents';
import { parseFloatOrDefault } from '../../../utils/mathUtils';

const None = 'none';
const Custom = 'custom';

const optionStrings = defineMessages({
  None: {
    defaultMessage: 'None',
    description: 'Distance Units in a dropdown menu',
  },
  Custom: {
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

export const ModelRefComponentEditor: React.FC<IComponentEditorProps> = ({
  node,
  component,
}: IComponentEditorProps) => {
  const modelRefComponent = component as IModelRefComponentInternal;
  const { formatMessage } = useIntl();

  const sceneComposerId = useSceneComposerId();
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const isCustomUoM = !!modelRefComponent.localScale;

  const update = useCallback(
    (componentPartial: any, replace?: boolean) => {
      const componentPartialWithRef: ISceneComponentInternal = { ref: component.ref, ...componentPartial };
      updateComponentInternal(node.ref, componentPartialWithRef, replace);
    },
    [node.ref, component.ref],
  );

  const distanceUnitsOptions = useMemo(
    () => [
      { label: formatMessage(optionStrings.None), value: None },
      { label: formatMessage(optionStrings.Custom), value: Custom },
      ...Object.keys(DistanceUnits).map((unit) => ({
        label: formatMessage(optionStrings[unit]) || unit,
        value: unit,
      })),
    ],
    [formatMessage],
  );

  const changeUnitOfMeasure = useCallback(
    ({ detail }) => {
      const selectedOption = detail.selectedOption.value;

      switch (selectedOption) {
        case Custom:
          update({ unitOfMeasure: undefined, localScale: [1, 1, 1] });
          break;
        case None:
          update({ unitOfMeasure: undefined, localScale: undefined });
          break;
        default:
          update({ unitOfMeasure: detail.selectedOption.value, localScale: undefined });
      }
    },
    [update],
  );

  return (
    <SpaceBetween size='s'>
      <FormField label={formatMessage({ defaultMessage: 'Model Type', description: 'Form Field label' })}>
        <Input value={modelRefComponent.modelType} disabled />
      </FormField>

      <FormField label={formatMessage({ defaultMessage: 'Model Path', description: 'Form Field label' })}>
        <Input value={modelRefComponent.uri} disabled />
      </FormField>

      <FormField label={formatMessage({ defaultMessage: 'Shadow Settings', description: 'Form Field label' })}>
        <Checkbox
          data-testid={'cast-shadow-checkbox'}
          onChange={(event) => {
            update({ castShadow: event.detail.checked });
          }}
          checked={modelRefComponent.castShadow ?? false}
        >
          {formatMessage({ defaultMessage: 'Cast Shadow', description: 'select box option text value' })}
        </Checkbox>
        <Checkbox
          data-testid={'receive-shadow-checkbox'}
          onChange={(event) => {
            update({ receiveShadow: event.detail.checked });
          }}
          checked={modelRefComponent.receiveShadow ?? false}
        >
          {formatMessage({ defaultMessage: 'Receive Shadow', description: 'select box option text value' })}
        </Checkbox>
      </FormField>

      <FormField label={formatMessage({ defaultMessage: 'Unit of Measure', description: 'Form Field label' })}>
        <Select
          selectedOption={
            isCustomUoM
              ? { label: formatMessage(optionStrings.Custom), value: Custom }
              : modelRefComponent.unitOfMeasure
              ? {
                  label:
                    formatMessage(optionStrings[modelRefComponent.unitOfMeasure as string]) ||
                    (modelRefComponent.unitOfMeasure as string),
                  value: modelRefComponent.unitOfMeasure as string,
                }
              : null
          }
          onChange={changeUnitOfMeasure}
          options={distanceUnitsOptions}
          selectedAriaLabel={formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience.',
          })}
          placeholder={formatMessage({ defaultMessage: 'Choose an option', description: 'placeholder' })}
        />
      </FormField>

      {isCustomUoM && (
        <NumericInput
          data-testid={'local-scale-numeric-input'}
          value={modelRefComponent.localScale![0]}
          setValue={(val) => {
            update({ localScale: [val, val, val] });
          }}
          toStr={(val) => val.toFixed(2)}
          fromStr={(str) => parseFloatOrDefault(str, 1)}
        />
      )}
    </SpaceBetween>
  );
};
