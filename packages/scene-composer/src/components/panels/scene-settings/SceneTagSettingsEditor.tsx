import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, FormField, Grid, Input } from '@awsui/components-react';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { IComponentSettingsMap, ITagSettings, KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { Slider } from '../Slider';
import useTagSettings from '../../../hooks/useTagSettings';

export const SceneTagSettingsEditor: React.FC = () => {
  useLifecycleLogging('SceneTagSettingsEditor');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);
  const getSceneProperty = useStore(sceneComposerId)((state) => state.getSceneProperty);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());
  const setTagSettings = useViewOptionState(sceneComposerId).setTagSettings;
  const tagSettings: ITagSettings = useTagSettings();
  const [dirty, setDirty] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [focusSlider, setFocusSlider] = useState(false);
  const [draggingSlider, setDraggingSlider] = useState(false);

  const [internalScale, setInternalScale] = useState(tagSettings.scale);

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
      setDirty(true);
    },
    [setInternalScale, setDirty],
  );

  const onInputBlur = useCallback(() => {
    // If slider is getting focus, this makes sure to execute setFocusSlider(true) first to keep showing it.
    const id = setTimeout(() => {
      setFocusInput(false);
    }, 1);
    return () => {
      clearTimeout(id);
    };
  }, [setFocusInput]);

  const onInputChange = useCallback(
    (event) => {
      let value = event.detail.value;
      if (value < 0) {
        value = 0;
      }

      if (value !== internalScale) {
        setInternalScale(Number(value));
        setDirty(true);
      }
    },
    [setInternalScale, setDirty],
  );

  // Save scale changes to settings
  useEffect(() => {
    // In viewing mode, dragging slider will update component immediately.
    if (dirty && !focusInput && (!draggingSlider || isViewing)) {
      updateSettings({ scale: internalScale });
      setDirty(false);
    }
  }, [updateSettings, setDirty, dirty, focusInput, internalScale, draggingSlider, isViewing]);

  // Update internal when scale in store is changed
  useEffect(() => {
    if (!dirty && tagSettings.scale !== internalScale) {
      setInternalScale(tagSettings.scale);
    }
  }, [dirty, draggingSlider, tagSettings.scale, internalScale]);

  return (
    <React.Fragment>
      <FormField label={intl.formatMessage({ defaultMessage: 'Scale', description: 'Form Field label' })}>
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <Input
            value={String(internalScale)}
            type='number'
            onFocus={() => setFocusInput(true)}
            onBlur={onInputBlur}
            onChange={onInputChange}
          />
          <Checkbox
            checked={tagSettings.autoRescale}
            onChange={(e) => updateSettings({ autoRescale: e.detail.checked })}
          >
            {intl.formatMessage({ defaultMessage: 'Auto rescale', description: 'checkbox label' })}
          </Checkbox>
        </Grid>

        {(focusInput || focusSlider) && (
          <Slider
            value={internalScale}
            step={0.1}
            min='0'
            max='10'
            onFocus={() => {
              setFocusSlider(true);
            }}
            onBlur={() => {
              setFocusSlider(false);
            }}
            onMouseUp={() => {
              setDraggingSlider(false);
            }}
            onMouseDown={() => {
              setDraggingSlider(true);
            }}
            onChange={onSliderChange}
          />
        )}
      </FormField>
    </React.Fragment>
  );
};
