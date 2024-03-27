import { Button, FormField, Icon, Input, InputProps, SpaceBetween, TextContent } from '@cloudscape-design/components';
import { NonCancelableCustomEvent } from '@cloudscape-design/components/internal/events';
import React, { useCallback, useEffect, useState } from 'react';
import { CirclePicker, ColorResult } from 'react-color';
import { useIntl } from 'react-intl';
import '../IconPicker/IconPickerUtils/IconPicker-aws-overrides.scss';
import { ColorRepresentation } from 'three';

import { colors } from '../../../../../utils/styleUtils';
import { IColorPickerProps } from '../interface';
import { ColorPicker } from '../../../ColorPicker/ColorPicker';
import { hexString } from '../../../ColorPicker/ColorPickerHelpers';

import {
  tmAddButton,
  tmColorPickerContainer,
  tmColorPickerPopover,
  tmCover,
  tmDivider,
  tmPopover,
} from './ColorSelectorComboUtils/ColorSelectorComboStyles';
import { colorPickerPreviewSvg } from './ColorSelectorComboUtils/SvgParserHelper';
import { palleteColors } from './ColorSelectorComboUtils/TagColors';

export const ColorSelectorCombo = ({
  color,
  onSelectColor,
  customColors,
  onUpdateCustomColors,
  colorPickerLabel,
  customColorLabel,
}: IColorPickerProps): JSX.Element => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [newColor, setNewColor] = useState<string>(color);
  const [showChromePicker, setShowChromePicker] = useState<boolean>(false);
  const [hexCodeError, setHexCodeError] = useState<string>(''); // State variable for hex code error
  const [customInternalColors, setCustomInternalColors] = useState<string[]>(customColors ?? []);
  const [customColor, setCustomColor] = useState<string | undefined>(undefined);
  const generateRandomString = Math.random().toString(16).slice(2);
  const [randomDomId] = useState<string>(generateRandomString);
  const intl = useIntl();

  /**
   * This method uses a regular expression (`hexRegex`) to validate a hex color code.
   * The regex checks if the hex code starts with a "#" symbol, followed by either a
   * 6-digit or 3-digit combination of characters from A-F, a-f, and 0-9.
   * The `test` method is then used to validate the `hexCode` against the regex pattern.
   * @param hexCode
   * @returns
   */
  const isValidHexCode = (hexCode: string) => {
    const hexRegex = /^#([A-Fa-f0-9]{6})$/;
    return hexRegex.test(hexCode);
  };

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const buttonsvg = document.getElementById('button-svg' + `${randomDomId}`);
    if (buttonsvg && buttonsvg.contains(target)) {
      return; // We have a different handler for button click
    }
    const pickerContainer = document.getElementById('circle-picker' + `${randomDomId}`);
    if (pickerContainer && !pickerContainer.contains(target)) {
      setShowPicker(false);
    }
  }, []);

  useEffect(() => {
    if (showPicker) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showPicker, handleOutsideClick]);

  const checkIfCustomColor = useCallback(
    (color): void => {
      if (!Object.values(palleteColors).includes(color) && color !== colors.infoBlue) {
        const updatedColors: string[] = customColors ? customColors.concat(color) : [color];
        setCustomInternalColors(updatedColors);
        onUpdateCustomColors?.([...new Set(updatedColors)]);
      }
    },
    [customColors, onUpdateCustomColors],
  );

  const handleShowChromePicker = () => {
    setShowChromePicker(true);
    setShowPicker(false);
  };

  const handleClose = () => {
    setShowPicker(false);
    setShowChromePicker(false);
  };

  const handleCloseCustomPicker = () => {
    setShowChromePicker(false);
  };

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      checkIfCustomColor(color.hex);
      setHexCodeError(''); // Clear any existing error message
      setNewColor(color.hex);
      onSelectColor(color.hex);
      setCustomColor(color.hex);
    },
    [color, onSelectColor, onUpdateCustomColors],
  );

  const handleHexCodeChange = useCallback(
    (event: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
      setNewColor(event.detail.value);
      if (isValidHexCode(event.detail.value)) {
        setHexCodeError(''); // Clear any existing error message
        onSelectColor(event.detail.value);
        checkIfCustomColor(event.detail.value);
      } else {
        setHexCodeError(
          intl.formatMessage({ defaultMessage: 'Invalid hex code', description: 'hex validations messages' }),
        ); // Set the error message
      }
    },
    [color, onSelectColor],
  );

  const handleCustomPickerSelection = (color: ColorRepresentation) => {
    checkIfCustomColor(color);
    setNewColor(hexString(color));
    onSelectColor(hexString(color));
  };

  useEffect(() => {
    setNewColor(color);
  }, [color]);

  return (
    <SpaceBetween size='l'>
      <FormField errorText={hexCodeError}>
        <SpaceBetween size='m' direction='horizontal'>
          <TextContent>
            <h5>{colorPickerLabel}</h5>
          </TextContent>
          <Button
            id={'button-svg' + `${randomDomId}`}
            data-testid='color-preview'
            ariaLabel={intl.formatMessage({ defaultMessage: 'colorPreview', description: 'color picker preview' })}
            variant='inline-icon'
            iconSvg={<Icon size='big' svg={colorPickerPreviewSvg(newColor)} />}
            onClick={() => {
              setShowPicker(!showPicker);
              setHexCodeError('');
            }}
          />
          <Input
            className='tm-color-picker-button'
            ariaLabel={intl.formatMessage({ defaultMessage: 'Hex code', description: 'color picker label' })}
            data-testid='hexcode'
            value={newColor}
            onChange={handleHexCodeChange}
          />
          <div id={'circle-picker' + `${randomDomId}`} style={tmColorPickerContainer}>
            {showPicker && !showChromePicker && (
              <div style={tmColorPickerPopover}>
                <div>
                  <div style={tmCover} onClick={handleClose} />
                  <CirclePicker
                    width='300px'
                    data-testid='circlePicker'
                    aria-label={intl.formatMessage({ defaultMessage: 'circlePicker', description: 'circle picker' })}
                    colors={[...new Set(Object.values(palleteColors))]}
                    color={color}
                    onChange={handleColorChange}
                  />
                </div>
                <div style={tmDivider} />
                <TextContent>
                  <h5>{customColorLabel}</h5>
                </TextContent>
                <SpaceBetween size='s'>
                  <CirclePicker
                    width='300px'
                    colors={[...new Set(customInternalColors)]}
                    color={customColor}
                    onChange={handleColorChange}
                  />
                  <button style={tmAddButton} onClick={handleShowChromePicker}>
                    <Icon name='add-plus' />
                  </button>
                </SpaceBetween>
              </div>
            )}
          </div>
        </SpaceBetween>
      </FormField>
      {showChromePicker && (
        <div style={tmPopover}>
          <div
            aria-label={intl.formatMessage({ defaultMessage: 'chromePicker', description: 'chrome picker' })}
            style={tmCover}
            onClick={handleCloseCustomPicker}
          />
          <ColorPicker color={newColor} onChange={handleCustomPickerSelection} />
        </div>
      )}
    </SpaceBetween>
  );
};
