import React, { Fragment, useContext } from 'react';
import { Box, FormField, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl, defineMessages } from 'react-intl';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { presets } from '../three-fiber/Environment';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { useStore } from '../../store';
import {
  COMPOSER_FEATURES,
  EnvironmentPreset,
  IValueDataBindingProvider,
  KnownComponentType,
  KnownSceneProperty,
} from '../../interfaces';
import { pascalCase } from '../../utils/stringUtils';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { Component } from '../../models/SceneModels';
import { Divider } from '../Divider';

import { ExpandableInfoSection } from './CommonPanelComponents';
import { MatterportIntegration, SceneDataBindingTemplateEditor, SceneTagSettingsEditor } from './scene-settings';
import { ComponentVisibilityToggle } from './scene-settings/ComponentVisibilityToggle';
import { OverlayPanelVisibilityToggle } from './scene-settings/OverlayPanelVisibilityToggle';

export interface SettingsPanelProps {
  valueDataBindingProvider?: IValueDataBindingProvider;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ valueDataBindingProvider }) => {
  const log = useLifecycleLogging('SettingsPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);
  const isEditing = useStore(sceneComposerId)((state) => state.isEditing());
  const intl = useIntl();

  const tagResizeEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.TagResize];
  const matterportEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Matterport];
  const overlayEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Overlay];

  const selectedEnvPreset = useStore(sceneComposerId)((state) =>
    state.getSceneProperty(KnownSceneProperty.EnvironmentPreset),
  );

  log?.verbose('Selected environment preset', selectedEnvPreset);

  const i18nPresetsStrings = defineMessages({
    noPreset: {
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
    [Component.DataOverlaySubType.TextAnnotation]: {
      defaultMessage: 'Annotation',
      description: 'Sub section label',
    },
  });

  const presetOptions = [
    ...Object.keys(presets).map((preset) => ({
      label: intl.formatMessage(i18nPresetsStrings[preset]) || pascalCase(preset),
      value: preset !== EnvironmentPreset.noPreset ? preset : '',
    })),
  ];

  const isNoPreset = selectedEnvPreset === '' || selectedEnvPreset === undefined;

  const selectedOption = !isNoPreset
    ? {
        label: intl.formatMessage(i18nPresetsStrings[selectedEnvPreset]) || pascalCase(selectedEnvPreset),
        value: selectedEnvPreset,
      }
    : {
        label: intl.formatMessage(i18nPresetsStrings.noPreset),
        value: '',
      };

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
          <ComponentVisibilityToggle
            componentType={KnownComponentType.MotionIndicator}
            label={intl.formatMessage(visibilityToggleLabels[KnownComponentType.MotionIndicator])}
          />
          <Divider />
          <ComponentVisibilityToggle
            componentType={KnownComponentType.Tag}
            label={intl.formatMessage(visibilityToggleLabels[KnownComponentType.Tag])}
          />
          {overlayEnabled && (
            <>
              <Divider />
              <ComponentVisibilityToggle
                componentType={Component.DataOverlaySubType.OverlayPanel}
                label={intl.formatMessage(visibilityToggleLabels[Component.DataOverlaySubType.OverlayPanel])}
              />
            </>
          )}
          {overlayEnabled && (
            <>
              <Divider />
              <ComponentVisibilityToggle
                componentType={Component.DataOverlaySubType.TextAnnotation}
                label={intl.formatMessage(visibilityToggleLabels[Component.DataOverlaySubType.TextAnnotation])}
              />
            </>
          )}
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
                  if (e.detail.selectedOption.value === EnvironmentPreset.noPreset) {
                    setSceneProperty(KnownSceneProperty.EnvironmentPreset, '');
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
      )}

      {(tagResizeEnabled || overlayEnabled) && (
        <ExpandableInfoSection
          title={intl.formatMessage({ description: 'ExpandableInfoSection Title', defaultMessage: 'Tag Settings' })}
          defaultExpanded={false}
        >
          {tagResizeEnabled && <SceneTagSettingsEditor />}
          {overlayEnabled && isEditing && <OverlayPanelVisibilityToggle />}
        </ExpandableInfoSection>
      )}

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
          defaultExpanded
        >
          <MatterportIntegration />
        </ExpandableInfoSection>
      )}
    </Fragment>
  );
};
