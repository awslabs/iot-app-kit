import React, { useCallback, useState } from 'react';
import { ChromePicker, CirclePicker } from 'react-color';
import { Button, FormField, Icon, Input, InputProps, SpaceBetween } from '@awsui/components-react';
import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';

import { IColorPickerProps } from '../interface';

import { colorPickerPreviewSvg } from './ColorPickerUtils/SvgParserHelper';
import { colorArray, palleteColors } from './ColorPickerUtils/TagColors';
import {
  addButton,
  chromePickerContainer,
  colorPickerContainer,
  cover,
  customColors,
  divider,
  labelContainer,
  popover,
  secondCirclePickerContainer,
  tmColorPickerPopover,
} from './ColorPickerUtils/ColorPickerStyles';

export const ColorPicker = ({ color, onSelectColor, label }: IColorPickerProps) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [showChromePicker, setShowChromePicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [addedColors, setAddedColors] = useState<string[]>([]);

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

  const handleColorSelection = useCallback(() => {
    setAddedColors((prevColors) => [...prevColors, selectedColor]);
    setSelectedColor('');
    onSelectColor(color);
  }, []);

  const handleClose = useCallback(() => {
    setShowPicker(false);
  }, []);

  const handleCloseChromePicker = useCallback(() => {
    setShowChromePicker(false);
  }, []);

  return (
    <SpaceBetween size='m' direction='horizontal'>
      <FormField label={label}></FormField>
      <Button
        data-testid='color-preview'
        ariaLabel='color-picker-preview'
        variant='inline-icon'
        iconSvg={<Icon size='big' svg={colorPickerPreviewSvg(color)} />}
        onClick={() => {
          handleClick();
          onSelectColor(color);
        }}
      />
      <Input ariaLabel='hexcode' data-testid='hexcode' value={color} onChange={handleHexCodeChange} />
      <div style={colorPickerContainer}>
        {showPicker && !showChromePicker && (
          <div style={tmColorPickerPopover} onClick={handleClose}>
            <CirclePicker
              width='300px'
              data-testid='circlePicker'
              aria-label='color'
              colors={colorArray(palleteColors)}
              color={color}
              onChange={handleColorChange}
            />
            <div style={divider} />
            <button style={addButton} onClick={handleShowChromePicker}>
              +
            </button>
          </div>
        )}
        {showChromePicker && (
          <div>
            <div style={cover} onClick={handleCloseChromePicker}/>
            <ChromePicker disableAlpha color={color} onChangeComplete={(newColor) => onSelectColor(newColor.hex)} />
          </div>
        )}
      </div>
    </SpaceBetween>
  );
};
