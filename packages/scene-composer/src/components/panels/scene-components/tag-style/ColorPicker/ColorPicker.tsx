import { Button, FormField, Icon, Input, InputProps, SpaceBetween, TextContent } from '@awsui/components-react';
import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';
import React, { useCallback, useState } from 'react';
import { ChromePicker, CirclePicker } from 'react-color';
import { useIntl } from 'react-intl';

import { IColorPickerProps } from '../interface';

import {
  tmAddButton,
  tmColorPickerContainer,
  tmColorPickerPopover,
  tmCover,
  tmDivider,
  tmPopover,
} from './ColorPickerUtils/ColorPickerStyles';
import { colorPickerPreviewSvg } from './ColorPickerUtils/SvgParserHelper';
import { palleteColors } from './ColorPickerUtils/TagColors';

export const ColorPicker = ({ color, onSelectColor, label }: IColorPickerProps): JSX.Element => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [newColor, setNewColor] = useState<string>(color);
  const [showChromePicker, setShowChromePicker] = useState<boolean>(false);
  const [hexCodeError, setHexCodeError] = useState<string>(''); // State variable for hex code error

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
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hexCode);
  };

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const handleColorChange = (color) => {
    setNewColor(color.hex);
    onSelectColor(color.hex);
  };

  const handleHexCodeChange = useCallback((event: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
    setNewColor(event.detail.value);
    if (isValidHexCode(event.detail.value)) {
      setHexCodeError(''); // Clear any existing error message
      onSelectColor(event.detail.value);
    } else {
      setHexCodeError(
        intl.formatMessage({ defaultMessage: 'Invalid hex code', description: 'hex validations messages' }),
      ); // Set the error message
    }
  }, []);

  const handleShowChromePicker = () => {
    setShowChromePicker(true);
    setShowPicker(false);
  };

  const handleClose = () => {
    setShowPicker(false);
    setShowChromePicker(false);
  };

  const handleCloseChromePicker = () => {
    setShowChromePicker(false);
  };

  return (
    <SpaceBetween size='m'>
      <FormField errorText={hexCodeError}>
        <SpaceBetween size='m' direction='horizontal'>
          <TextContent>
            <h5>{label}</h5>
          </TextContent>
          <Button
            data-testid='color-preview'
            ariaLabel={intl.formatMessage({ defaultMessage: 'colorPreview', description: 'color picker preview' })}
            variant='inline-icon'
            iconSvg={<Icon size='big' svg={colorPickerPreviewSvg(color)} />}
            onClick={() => {
              handleClick();
              setHexCodeError('');
            }}
          />
          <Input
            ariaLabel={intl.formatMessage({ defaultMessage: 'Hex code', description: 'color picker label' })}
            data-testid='hexcode'
            value={newColor}
            onChange={handleHexCodeChange}
          />
          <div style={tmColorPickerContainer}>
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
                <button style={tmAddButton} onClick={handleShowChromePicker}>
                  <Icon name='add-plus' />
                </button>
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
            onClick={handleCloseChromePicker}
          />
          <ChromePicker color={color} onChangeComplete={(newColor) => onSelectColor(newColor.hex)} />
        </div>
      )}
    </SpaceBetween>
  );
};
