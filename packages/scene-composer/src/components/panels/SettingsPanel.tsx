import React, { Fragment, useContext } from 'react';
import { FormField, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl, defineMessages } from 'react-intl';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { presets } from '../three-fiber/Environment';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useStore } from '../../store';
import { COMPOSER_FEATURES, IValueDataBindingProvider, KnownSceneProperty } from '../../interfaces';
import { pascalCase } from '../../utils/stringUtils';
import { getGlobalSettings } from '../../common/GlobalSettings';

import { ExpandableInfoSection } from './CommonPanelComponents';
import { MatterportIntegration, SceneDataBindingTemplateEditor, SceneTagSettingsEditor } from './scene-settings';

export interface SettingsPanelProps {
  valueDataBindingProvider?: IValueDataBindingProvider;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ valueDataBindingProvider }) => {
  const log = useLifecycleLogging('SettingsPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);
  const intl = useIntl();

  const tagResizeEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.TagResize];
  const matterportEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Matterport];

  const selectedEnvPreset = useStore(sceneComposerId)((state) =>
    state.getSceneProperty(KnownSceneProperty.EnvironmentPreset),
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

  const presetOptions = [
    { label: intl.formatMessage(i18nPresetsStrings['No Preset']), value: 'n/a' },
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
        title={intl.formatMessage({ description: 'ExpandableInfoSection Title', defaultMessage: 'Scene Settings' })}
        defaultExpanded
      >
        <SpaceBetween size='s'>
          <FormField
            label={intl.formatMessage({ description: 'Form Field label', defaultMessage: 'Environment Preset' })}
          >
            <Select
              selectedOption={selectedOption}
              onChange={(e) => {
                if (e.detail.selectedOption.value === 'n/a') {
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
        </SpaceBetween>
      </ExpandableInfoSection>

      {tagResizeEnabled && (
        <ExpandableInfoSection
          title={intl.formatMessage({ description: 'ExpandableInfoSection Title', defaultMessage: 'Tag Settings' })}
          defaultExpanded
        >
          <SceneTagSettingsEditor />
        </ExpandableInfoSection>
      )}

      {valueDataBindingProvider && (
        <ExpandableInfoSection
          title={intl.formatMessage({
            description: 'ExpandableInfoSection Title',
            defaultMessage: 'Data Binding Template',
          })}
          defaultExpanded
        >
          <SceneDataBindingTemplateEditor valueDataBindingProvider={valueDataBindingProvider} />
        </ExpandableInfoSection>
      )}

      {matterportEnabled && (
        <ExpandableInfoSection
          title={intl.formatMessage({
            description: 'ExpandableInfoSection Title',
            defaultMessage: '3rd Party Resources',
          })}
          defaultExpanded
        >
          <MatterportIntegration />
        </ExpandableInfoSection>
      )}
    </Fragment>
  );
};
