import React, { useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { Checkbox, FormField, Select, SpaceBetween } from '@cloudscape-design/components';

import useLogger from '../../../logger/react-logger/hooks/useLogger';
import { Component, LightType } from '../../../models/SceneModels';
import { ILightComponentInternal, accessStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IComponentEditorProps } from '../ComponentEditor';
import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../../common/constants';
import { parseFloatOrDefault } from '../../../utils/mathUtils';
import { NumericInput } from '../CommonPanelComponents';
import { ColorPicker } from '../ColorPicker/ColorPicker';

type OnLightSettingsUpdatedCallback = (lightSettings: Component.ILightSettings) => void;

function CreateInputForField(
  fieldName: string,
  index: number,
  lightSettings,
  setLightSettings: (lightSettings) => void,
  setDirty: (dirty: boolean) => void,
) {
  const intl = useIntl();
  if (fieldName === 'color') {
    return (
      <FormField key={index} label={intl.formatMessage({ defaultMessage: 'Color', description: 'Form Field label' })}>
        <ColorPicker
          color={lightSettings.color}
          onChange={(newColor: string) => {
            setLightSettings({ ...lightSettings, color: newColor });
            setDirty(true);
          }}
        />
      </FormField>
    );
  } else if (fieldName === 'intensity') {
    return (
      <FormField
        key={index}
        label={intl.formatMessage({ defaultMessage: 'Intensity', description: 'Form Field label' })}
        data-testid='intensity-form-field'
      >
        <NumericInput
          value={lightSettings.intensity}
          setValue={(val) => {
            setLightSettings({ ...lightSettings, intensity: val });
            setDirty(true);
          }}
          toStr={(val) => val.toFixed(2)}
          fromStr={(str) => parseFloatOrDefault(str, 1)}
        />
      </FormField>
    );
  } else if (fieldName === 'castShadow') {
    return (
      <FormField
        key={index}
        label={intl.formatMessage({ defaultMessage: 'Cast Shadow', description: 'Form Field label' })}
      >
        <Checkbox
          data-testid='cast-shadow-checkbox'
          onChange={(event) => {
            setLightSettings({ ...lightSettings, castShadow: event.detail.checked });
            setDirty(true);
          }}
          checked={lightSettings.castShadow ?? false}
        >
          {intl.formatMessage({ defaultMessage: 'Enable Shadow', description: 'checkbox option' })}
        </Checkbox>
      </FormField>
    );
  } else if (fieldName === 'distance') {
    return (
      <FormField
        key={index}
        label={intl.formatMessage({ defaultMessage: 'Distance', description: 'Form Field label' })}
        data-testid='distance-form-field'
      >
        <NumericInput
          value={lightSettings.distance}
          setValue={(val) => {
            setLightSettings({ ...lightSettings, distance: val });
            setDirty(true);
          }}
          toStr={(val) => val.toFixed(2)}
          fromStr={(str) => parseFloatOrDefault(str, 0)}
        />
      </FormField>
    );
  } else if (fieldName === 'decay') {
    return (
      <FormField
        key={index}
        label={intl.formatMessage({ defaultMessage: 'Decay', description: 'Form Field label' })}
        data-testid='decay-form-field'
      >
        <NumericInput
          value={lightSettings.decay}
          setValue={(val) => {
            setLightSettings({ ...lightSettings, decay: val });
            setDirty(true);
          }}
          toStr={(val) => val.toFixed(2)}
          fromStr={(str) => parseFloatOrDefault(str, 2)}
        />
      </FormField>
    );
  } else if (fieldName === 'groundColor') {
    return (
      <FormField
        key={index}
        label={intl.formatMessage({ defaultMessage: 'Ground Color', description: 'Form Field label' })}
      >
        <ColorPicker
          color={lightSettings.groundColor}
          onChange={(newColor: string) => {
            setLightSettings({ ...lightSettings, groundColor: newColor });
            setDirty(true);
          }}
        />
      </FormField>
    );
  }
}

function LightSettingsEditor(props: {
  lightSettings: Component.ILightSettings;
  onSettingsUpdated: OnLightSettingsUpdatedCallback;
}) {
  const [lightSettings, setLightSettings] = useState(props.lightSettings);
  const [dirty, setDirty] = useState(false);

  useLayoutEffect(() => {
    // recalculate local state
    setLightSettings(props.lightSettings);
  }, [props.lightSettings]);

  useEffect(() => {
    if (dirty) {
      props.onSettingsUpdated(lightSettings);
      setDirty(false);
    }
  }, [lightSettings, dirty]);

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        {Object.keys(lightSettings).map((field, index) =>
          CreateInputForField(field, index, lightSettings, setLightSettings, setDirty),
        )}
      </SpaceBetween>
    </React.Fragment>
  );
}

function createLightSettingsEditor(
  component: ILightComponentInternal,
  onSettingsUpdated: OnLightSettingsUpdatedCallback,
) {
  switch (component.lightType) {
    case LightType.Directional:
    case LightType.Point:
    case LightType.Ambient:
    case LightType.Hemisphere:
      return <LightSettingsEditor lightSettings={component.lightSettings} onSettingsUpdated={onSettingsUpdated} />;
    default:
      return <React.Fragment></React.Fragment>;
  }
}

export const LightComponentEditor: React.FC<IComponentEditorProps> = ({ node, component }: IComponentEditorProps) => {
  const lightComponent = component as ILightComponentInternal;
  const intl = useIntl();
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = accessStore(sceneComposerId)((state) => state.updateComponentInternal);
  const log = useLogger('LightComponentEditor');
  const getSceneNodeByRef = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const i18nLightTypestrings = defineMessages({
    Directional: {
      defaultMessage: 'Directional',
      description: 'Light Type in a dropdown menu',
    },
    Ambient: {
      defaultMessage: 'Ambient',
      description: 'Light Type in a dropdown menu',
    },
    Hemisphere: {
      defaultMessage: 'Hemisphere',
      description: 'Light Type in a dropdown menu',
    },
    Point: {
      defaultMessage: 'Point',
      description: 'Light Type in a dropdown menu',
    },
  });

  const options = Object.keys(LightType).map((lightType) => ({
    label: intl.formatMessage(i18nLightTypestrings[lightType]) || lightType,
    value: lightType,
  }));

  const onLightSettingsUpdated = useCallback(
    (lightSettings: Component.ILightSettings) => {
      log?.verbose('updated on light settings', lightSettings);

      const currentLightComponent = getSceneNodeByRef(node.ref)?.components.find(
        (c) => c.ref === component.ref,
      ) as ILightComponentInternal;

      const updatedLightComponent: ILightComponentInternal = {
        ...currentLightComponent,
        lightSettings: lightSettings,
      };

      updateComponentInternal(node.ref, updatedLightComponent, true);
    },
    [log, updateComponentInternal, node.ref, component.ref],
  );

  const onLightTypeUpdated = (lightType: string) => {
    // fetch the latest component and compare
    const currentLightComponent = getSceneNodeByRef(node.ref)?.components.find(
      (c) => c.ref === component.ref,
    ) as ILightComponentInternal;
    if (currentLightComponent && currentLightComponent.lightType !== lightType) {
      const updatedLightComponent: ILightComponentInternal = {
        ...currentLightComponent,
        lightType: lightType as LightType,
        lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[lightType],
      };
      updateComponentInternal(node.ref, updatedLightComponent, true);
    }
  };

  const lightSettingsEditor = createLightSettingsEditor(lightComponent, onLightSettingsUpdated);

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        <FormField label={intl.formatMessage({ defaultMessage: 'Light Type', description: 'Form Field label' })}>
          <Select
            selectedOption={{
              label:
                intl.formatMessage(i18nLightTypestrings[lightComponent.lightType as string]) ||
                (lightComponent.lightType as string),
              value: lightComponent.lightType as string,
            }}
            onChange={({ detail }) => {
              onLightTypeUpdated(detail.selectedOption.value!);
            }}
            options={options}
            selectedAriaLabel={intl.formatMessage({
              defaultMessage: 'Selected',
              description:
                'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
            })}
          />
        </FormField>

        {lightSettingsEditor}
      </SpaceBetween>
    </React.Fragment>
  );
};
