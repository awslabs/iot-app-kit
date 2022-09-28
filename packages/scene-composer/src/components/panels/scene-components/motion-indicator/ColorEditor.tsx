import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, FormField, Grid, Icon, Select, SpaceBetween } from '@awsui/components-react';
import { isEmpty } from 'lodash';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import { defineMessages, useIntl } from 'react-intl';

import { IMotionIndicatorComponentInternal, useStore } from '../../../../store';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { Component } from '../../../../models/SceneModels';
import { colors } from '../../../../utils/styleUtils';

import { DataBindingEditor } from './DataBindingEditor';
import { Slider } from './Slider';

const ColorSwatch = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  width: 100%;
  height: 30px;
  border-style: solid;
  border-width: 1px;
  border-color: ${colors.containerBorderWhite};
  cursor: pointer;
`;

interface IColorEditorProps {
  component: IMotionIndicatorComponentInternal;
  selectedColorType:
    | Component.MotionIndicatorDataBindingName.BackgroundColor
    | Component.MotionIndicatorDataBindingName.ForegroundColor;
  onUpdateCallback: (componentPartial: any, replace?: boolean | undefined) => void;
}

const ColorEditor: React.FC<IColorEditorProps> = ({ component, selectedColorType, onUpdateCallback }) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const { formatMessage } = useIntl();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorDataBinding, setShowColorDataBinding] = useState(
    !isEmpty(component.valueDataBindings[selectedColorType]),
  );

  const toggleColorPicker = () => setShowColorPicker(!showColorPicker);
  const [showSlider, setShowSlider] = useState(false);
  const colorOptions = [
    { label: formatMessage({ defaultMessage: 'Select color', description: 'label' }), value: 'default' },
    { label: formatMessage({ defaultMessage: 'Add color rule', description: 'label' }), value: 'binding' },
  ];

  const i18ncolorEditorStrings = defineMessages({
    opacityButton: {
      defaultMessage: 'Opacity : {opacityPercentage, number, percent}',
      description: 'Button text for color opacity percentage',
    },
  });

  const selectedForegroundColor = selectedColorType === Component.MotionIndicatorDataBindingName.ForegroundColor;

  // hide slider when selected color type changes between foreground and background
  useEffect(() => {
    setShowSlider(false);
  }, [selectedColorType]);

  // reset states when component changed
  useEffect(() => {
    setShowColorDataBinding(!isEmpty(component.valueDataBindings[selectedColorType]));
    setShowColorPicker(false);
  }, [component.ref]);

  return (
    <SpaceBetween size='s'>
      <FormField
        label={
          selectedColorType === Component.MotionIndicatorDataBindingName.ForegroundColor
            ? formatMessage({ defaultMessage: 'Define arrow color', description: 'Select Color type option' })
            : formatMessage({ defaultMessage: 'Define background color', description: 'Select Color type option' })
        }
      >
        <Select
          data-testid={'motion-indicator-color-select'}
          selectedOption={showColorDataBinding ? colorOptions[1] : colorOptions[0]}
          onChange={(e) => {
            const value = e.detail.selectedOption.value;
            const useBinding = value === 'binding';
            let updatedComponent: IMotionIndicatorComponentInternal;
            if (!useBinding) {
              updatedComponent = {
                ...component,
                valueDataBindings: {
                  ...component.valueDataBindings,
                  [selectedColorType]: {},
                },
              };
            } else {
              updatedComponent = {
                ...component,
                config: {
                  ...component.config,
                  [selectedForegroundColor ? 'defaultForegroundColor' : 'defaultBackgroundColor']: undefined,
                },
              };
            }

            onUpdateCallback(updatedComponent, true);
            setShowColorDataBinding(useBinding);
            setShowColorPicker(false);
          }}
          options={colorOptions}
          selectedAriaLabel={formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
          })}
          placeholder={formatMessage({ defaultMessage: 'Choose a color value', description: 'Placeholder' })}
        />
      </FormField>

      {selectedForegroundColor && !showColorDataBinding && (
        <FormField label={formatMessage({ defaultMessage: 'Arrow color', description: 'FormField label' })}>
          <Grid gridDefinition={[{ colspan: 2 }]}>
            <ColorSwatch
              data-testid={'foreground-color-swatch'}
              onClick={toggleColorPicker}
              backgroundColor={component.config.defaultForegroundColor as string}
            />
          </Grid>
        </FormField>
      )}

      {!selectedForegroundColor && (
        <FormField label={formatMessage({ defaultMessage: 'Background', description: 'FormField label' })}>
          <Grid gridDefinition={showColorDataBinding ? [{ colspan: 10 }] : [{ colspan: 2 }, { colspan: 10 }]}>
            {!showColorDataBinding && (
              <ColorSwatch
                data-testid={'background-color-swatch'}
                onClick={toggleColorPicker}
                backgroundColor={component.config.defaultBackgroundColor as string}
              />
            )}
            <Button data-testid={'opacity-button'} variant='normal' onClick={() => setShowSlider(!showSlider)}>
              {formatMessage(i18ncolorEditorStrings.opacityButton, {
                opacityPercentage: Math.round(component.config.backgroundColorOpacity * 100 ?? 100) / 100,
              })}
              <Box margin={{ left: 'xs' }} display='inline'>
                <Icon name={showSlider ? 'caret-down-filled' : 'caret-right-filled'} />
              </Box>
            </Button>
          </Grid>
          <Grid gridDefinition={showColorDataBinding ? [{ colspan: 10 }] : [{ colspan: 2 }, { colspan: 10 }]}>
            {!showColorDataBinding && <Box />}
            {showSlider && (
              <Slider
                value={component.config.backgroundColorOpacity * 100 ?? 100}
                step={1}
                min='0'
                max='100'
                onChange={(event) => {
                  const updatedComponent = {
                    ...component,
                    config: { ...component.config, backgroundColorOpacity: Number(event.target.value) / 100 },
                  };

                  onUpdateCallback(updatedComponent, true);
                }}
              />
            )}
          </Grid>
        </FormField>
      )}

      {showColorPicker && (
        <SketchPicker
          disableAlpha
          color={
            (selectedForegroundColor
              ? component.config.defaultForegroundColor
              : component.config.defaultBackgroundColor) as string
          }
          onChangeComplete={(newColor: any) => {
            const updatedComponent = {
              ...component,
              config: {
                ...component.config,
                defaultBackgroundColor: selectedForegroundColor ? undefined : newColor.hex,
                defaultForegroundColor: selectedForegroundColor ? newColor.hex : undefined,
              },
            };

            onUpdateCallback(updatedComponent, true);
          }}
        />
      )}

      {showColorDataBinding && (
        <>
          <Box fontWeight='bold' padding={{ top: 's' }}>
            {formatMessage({ defaultMessage: 'Configure Rule', description: 'Box label' })}
          </Box>

          <DataBindingEditor
            valueDataBindingProvider={valueDataBindingProvider}
            component={component}
            onUpdateCallback={onUpdateCallback}
            dataBindingName={selectedColorType}
          />
        </>
      )}
    </SpaceBetween>
  );
};

ColorEditor.displayName = 'ColorEditor';

export default ColorEditor;
