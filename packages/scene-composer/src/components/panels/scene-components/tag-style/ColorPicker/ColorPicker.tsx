import { Button, FormField, Icon, Input, InputProps, SpaceBetween } from '@awsui/components-react';
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
  const [showChromePicker, setShowChromePicker] = useState<boolean>(false);
  const intl = useIntl();

  const handleClick = useCallback(() => {
    setShowPicker(!showPicker);
  }, []);

  const handleColorChange = useCallback(
    (color) => {
      onSelectColor(color.hex);
    },
    [color],
  );

  const handleHexCodeChange = useCallback(
    (event: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
      onSelectColor(event.detail.value);
    },
    [color],
  );

  const handleShowChromePicker = useCallback(() => {
    setShowChromePicker(true);
    setShowPicker(false);
  }, []);

  const handleClose = useCallback(() => {
    setShowPicker(false);
    setShowChromePicker(false);
  }, []);

  const handleCloseChromePicker = useCallback(() => {
    setShowChromePicker(false);
  }, []);

  return (
    <SpaceBetween size='m'>
      <SpaceBetween size='m' direction='horizontal'>
        <FormField label={label} />
        <Button
          data-testid='color-preview'
          ariaLabel={intl.formatMessage({ defaultMessage: 'colorPreview', description: 'color picker preview' })}
          variant='inline-icon'
          iconSvg={<Icon size='big' svg={colorPickerPreviewSvg(color)} />}
          onClick={() => {
            handleClick();
            onSelectColor(color);
          }}
        />
        <Input
          ariaLabel={intl.formatMessage({ defaultMessage: 'Hex code', description: 'color picker label' })}
          data-testid='hexcode'
          value={color}
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
                  colors={Object.values(palleteColors)}
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
      {showChromePicker && (
        <div style={tmPopover}>
          <div
            aria-label={intl.formatMessage({ defaultMessage: 'chromePicker', description: 'chrome picker' })}
            style={tmCover}
            onClick={handleCloseChromePicker}
          />
          <ChromePicker disableAlpha color={color} onChangeComplete={(newColor) => onSelectColor(newColor.hex)} />
        </div>
      )}
    </SpaceBetween>
  );
};
