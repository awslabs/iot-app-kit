import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, FormField, Grid, Input, SpaceBetween, Toggle } from '@cloudscape-design/components';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { accessStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IComponentSettingsMap, ITagSettings, KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { Slider } from '../Slider';
import useTagSettings from '../../../hooks/useTagSettings';

export const SceneTagSettingsEditor: React.FC = () => {
  useLifecycleLogging('SceneTagSettingsEditor');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const setSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty);
  const getSceneProperty = accessStore(sceneComposerId)((state) => state.getSceneProperty);
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());
  const setTagSettings = useViewOptionState(sceneComposerId).setTagSettings;
  const tagSettings: ITagSettings = useTagSettings();
  const [focusInput, setFocusInput] = useState(false);
  const [focusSlider, setFocusSlider] = useState(false);
  const [draggingSlider, setDraggingSlider] = useState(false);
  const [internalScale, setInternalScale] = useState(tagSettings.scale);

  const handleInputFocus = useCallback(() => setFocusInput(true), []);
  const handleInputBlur = useCallback(() => setFocusInput(false), []);
  const handleSliderFocus = useCallback(() => setFocusSlider(true), []);
  const handleSliderBlur = useCallback(() => setFocusSlider(false), []);
  const handleSliderMouseUp = useCallback(() => setDraggingSlider(false), []);
  const handleSliderMouseDown = useCallback(() => setDraggingSlider(true), []);

  const updateSettings = useCallback(
    (settingsPartial: Partial<ITagSettings>) => {
      const newTagSettings: ITagSettings = {
        ...tagSettings,
        ...settingsPartial,
      };
      if (!isViewing) {
        const newComponentSettings: IComponentSettingsMap = {
          ...getSceneProperty(KnownSceneProperty.ComponentSettings),
          [KnownComponentType.Tag]: newTagSettings,
        };
        setSceneProperty(KnownSceneProperty.ComponentSettings, newComponentSettings);
      }
      setTagSettings(newTagSettings);
    },
    [tagSettings, getSceneProperty, setSceneProperty],
  );

  const onSliderChange = useCallback(
    (event) => {
      setInternalScale(Number(event.target.value));
    },
    [internalScale],
  );

  const onInputChange = useCallback(
    (event) => {
      let value = event.detail.value;
      if (value < 0) {
        value = 0;
      }
      if (value !== internalScale) {
        setInternalScale(Number(value));
      }
    },
    [internalScale],
  );

  useEffect(() => {
    if (internalScale !== tagSettings.scale) {
      updateSettings({ scale: internalScale });
    }
  }, [internalScale]);

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        <FormField label={intl.formatMessage({ defaultMessage: 'Scale', description: 'Form Field label' })}>
          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <Input
              value={String(internalScale)}
              type='number'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={onInputChange}
            />
            <Checkbox
              checked={tagSettings.autoRescale}
              onChange={(e) => updateSettings({ autoRescale: e.detail.checked })}
            >
              {intl.formatMessage({ defaultMessage: 'Fixed scaling', description: 'checkbox label' })}
            </Checkbox>
          </Grid>

          {(focusInput || focusSlider || draggingSlider) && (
            <Slider
              value={internalScale}
              step={0.1}
              min='0'
              max='10'
              onFocus={handleSliderFocus}
              onBlur={handleSliderBlur}
              onMouseUp={handleSliderMouseUp}
              onMouseDown={handleSliderMouseDown}
              onChange={onSliderChange}
            />
          )}
        </FormField>
        <Toggle
          checked={!tagSettings.enableOcclusion}
          onChange={(event) => {
            updateSettings({ enableOcclusion: !event.detail.checked });
          }}
        >
          {intl.formatMessage({ description: 'Toggle label', defaultMessage: 'Show tag through objects' })}
        </Toggle>
      </SpaceBetween>
    </React.Fragment>
  );
};
