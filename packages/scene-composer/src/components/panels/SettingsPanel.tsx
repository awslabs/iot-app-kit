import { Box, FormField, Select, SpaceBetween } from '@cloudscape-design/components';
import { Fragment, useContext } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getGlobalSettings } from '../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import useDynamicScene from '../../hooks/useDynamicScene';
import {
  COMPOSER_FEATURES,
  type IValueDataBindingProvider,
  KnownComponentType,
  KnownSceneProperty,
} from '../../interfaces';
import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { Component } from '../../models/SceneModels';
import { accessStore } from '../../store';
import { pascalCase } from '../../utils/stringUtils';
import { Divider } from '../Divider';
import { presets } from '../three-fiber/Environment';

import { ExpandableInfoSection } from './CommonPanelComponents';
import { MatterportIntegration, SceneDataBindingTemplateEditor, SceneTagSettingsEditor } from './scene-settings';
import { ComponentVisibilityToggle } from './scene-settings/ComponentVisibilityToggle';
import { ConvertSceneSettings } from './scene-settings/ConvertSceneSettings';
import { FogSettingsEditor } from './scene-settings/FogSettingsEditor';
import { GroundPlaneSettingsEditor } from './scene-settings/GroundPlaneSettingsEditor';
import { OverlayPanelVisibilityToggle } from './scene-settings/OverlayPanelVisibilityToggle';
import { SceneBackgroundSettingsEditor } from './scene-settings/SceneBackgroundSettingsEditor';
export interface SettingsPanelProps {
  valueDataBindingProvider?: IValueDataBindingProvider;
}

const NO_PRESET_VALUE = 'n/a';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ valueDataBindingProvider }) => {
  const log = useLifecycleLogging('SettingsPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const setSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty);
  const isEditing = accessStore(sceneComposerId)((state) => state.isEditing());
  const intl = useIntl();

  const matterportEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Matterport];
  const sceneAppearanceEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.SceneAppearance];
  const animationComponentEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Animations];
  const dynamicSceneEnabled = useDynamicScene();

  const selectedEnvPreset = accessStore(sceneComposerId)((state) =>
    state.getSceneProperty<string>(KnownSceneProperty.EnvironmentPreset),
  );

  log?.verbose('Selected environment preset', selectedEnvPreset);

  const i18nPresetsStrings = defineMessages({
    'No Preset': {
      defaultMessage: 'No Preset',
      description: 'Environment presets drop down menu options',
    },
    neutral: {
      defaultMessage: 'Neutral',
      description: 'Environment presets drop down menu options',
    },
    directional: {
      defaultMessage: 'Directional',
      description: 'Environment presets drop down menu options',
    },
    chromatic: {
      defaultMessage: 'Chromatic',
      description: 'Environment presets drop down menu options',
    },
  });

  const visibilityToggleLabels = defineMessages({
    [KnownComponentType.MotionIndicator]: {
      defaultMessage: 'Motion indicator',
      description: 'Sub section label',
    },
    [KnownComponentType.Tag]: {
      defaultMessage: 'Tag',
      description: 'Sub section label',
    },
    [Component.DataOverlaySubType.OverlayPanel]: {
      defaultMessage: 'Overlay',
      description: 'Sub section label',
    },
    [KnownComponentType.Animation]: {
      defaultMessage: 'Animation',
      description: 'Sub section label',
    },
    [Component.DataOverlaySubType.TextAnnotation]: {
      defaultMessage: 'Annotation',
      description: 'Sub section label',
    },
  });

  const presetOptions = [
    { label: intl.formatMessage(i18nPresetsStrings['No Preset']), value: NO_PRESET_VALUE },
    ...Object.keys(presets).map((preset) => ({
      label: intl.formatMessage(i18nPresetsStrings[preset]) || pascalCase(preset),
      value: preset,
    })),
  ];
  const selectedOption = selectedEnvPreset
    ? {
        label: intl.formatMessage(i18nPresetsStrings[selectedEnvPreset]) || pascalCase(selectedEnvPreset),
        value: selectedEnvPreset,
      }
    : null;

  return (
    <Fragment>
      <ExpandableInfoSection
        title={intl.formatMessage({
          description: 'ExpandableInfoSection Title',
          defaultMessage: 'Current View Settings',
        })}
        defaultExpanded
      >
        <FormField
          label={
            <Box fontWeight='bold'>
              {intl.formatMessage({ defaultMessage: 'Toggle visibility', description: 'FormField label' })}
            </Box>
          }
        >
          {animationComponentEnabled && (
            <>
              <ComponentVisibilityToggle
                componentType={KnownComponentType.Animation}
                label={intl.formatMessage(visibilityToggleLabels[KnownComponentType.Animation])}
              />
              <Divider />
            </>
          )}
          <ComponentVisibilityToggle
            componentType={KnownComponentType.MotionIndicator}
            label={intl.formatMessage(visibilityToggleLabels[KnownComponentType.MotionIndicator])}
          />
          <Divider />
          <ComponentVisibilityToggle
            componentType={KnownComponentType.Tag}
            label={intl.formatMessage(visibilityToggleLabels[KnownComponentType.Tag])}
          />
          <Divider />
          <ComponentVisibilityToggle
            componentType={Component.DataOverlaySubType.OverlayPanel}
            label={intl.formatMessage(visibilityToggleLabels[Component.DataOverlaySubType.OverlayPanel])}
          />
          <Divider />
          <ComponentVisibilityToggle
            componentType={Component.DataOverlaySubType.TextAnnotation}
            label={intl.formatMessage(visibilityToggleLabels[Component.DataOverlaySubType.TextAnnotation])}
          />
        </FormField>
      </ExpandableInfoSection>

      {isEditing && (
        <ExpandableInfoSection
          title={intl.formatMessage({ description: 'ExpandableInfoSection Title', defaultMessage: 'Scene Settings' })}
          defaultExpanded={false}
        >
          <SpaceBetween size='s'>
            <FormField
              label={intl.formatMessage({ description: 'Form Field label', defaultMessage: 'Environment Preset' })}
            >
              <Select
                selectedOption={selectedOption}
                onChange={(e) => {
                  if (e.detail.selectedOption.value === NO_PRESET_VALUE) {
                    setSceneProperty(KnownSceneProperty.EnvironmentPreset, undefined);
                  } else {
                    setSceneProperty(KnownSceneProperty.EnvironmentPreset, e.detail.selectedOption.value);
                  }
                }}
                options={presetOptions}
                selectedAriaLabel={intl.formatMessage({ defaultMessage: 'Selected', description: 'label' })}
                disabled={presetOptions.length === 0}
                placeholder={intl.formatMessage({
                  defaultMessage: 'Choose an environment',
                  description: 'choose environment placeholder',
                })}
                expandToViewport
              />
            </FormField>
            {sceneAppearanceEnabled && (
              <>
                <FogSettingsEditor />
                <SceneBackgroundSettingsEditor />
                <GroundPlaneSettingsEditor />
              </>
            )}
          </SpaceBetween>
        </ExpandableInfoSection>
      )}

      <ExpandableInfoSection
        title={intl.formatMessage({ description: 'ExpandableInfoSection Title', defaultMessage: 'Tag Settings' })}
        defaultExpanded={false}
      >
        <SceneTagSettingsEditor />
        {isEditing && <OverlayPanelVisibilityToggle />}
      </ExpandableInfoSection>

      {valueDataBindingProvider && isEditing && (
        <ExpandableInfoSection
          title={intl.formatMessage({
            description: 'ExpandableInfoSection Title',
            defaultMessage: 'Data Binding Template',
          })}
          defaultExpanded={false}
        >
          <SceneDataBindingTemplateEditor valueDataBindingProvider={valueDataBindingProvider} />
        </ExpandableInfoSection>
      )}

      {matterportEnabled && isEditing && (
        <ExpandableInfoSection
          title={intl.formatMessage({
            description: 'ExpandableInfoSection Title',
            defaultMessage: '3rd Party Resources',
          })}
          defaultExpanded={false}
        >
          <MatterportIntegration />
        </ExpandableInfoSection>
      )}

      {dynamicSceneEnabled && isEditing && (
        <ExpandableInfoSection
          title={intl.formatMessage({
            description: 'ExpandableInfoSection Title',
            defaultMessage: 'Convert scene',
          })}
          defaultExpanded={false}
        >
          <ConvertSceneSettings />
        </ExpandableInfoSection>
      )}
    </Fragment>
  );
};
