import React, { useCallback, useState } from 'react';
import { ChromePicker, CirclePicker } from 'react-color';
import { Button, FormField, Icon, Input, InputProps, SpaceBetween } from '@awsui/components-react';
import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';

import { IColorPickerProps } from '../interface';

import { colorPickerPreviewSvg } from './ColorPickerUtils/SvgParserHelper';
import { colorArray, palleteColors } from './ColorPickerUtils/TagColors';
import { tmClose, tmColorPickerPopover } from './ColorPickerUtils/ColorPickerStyles';

export const ColorPicker = ({ color, onSelectColor, label }: IColorPickerProps) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

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

  const handleClose = useCallback(() => {
    setShowPicker(false);
  }, []);

  return (
    <SpaceBetween size='m' direction='horizontal'>
      <FormField label={label}></FormField>
      <Button
        data-testid='color-preview'
        aria-label='color-picker-preview'
        variant='inline-icon'
        iconSvg={<Icon size='big' svg={colorPickerPreviewSvg(color)} />}
        onClick={() => {
          onSelectColor(color);
          handleClick();
        }}
      />
      <FormField stretch>
        <Input data-testid='hexcode' value={color} onChange={handleHexCodeChange} />
      </FormField>
      {showPicker && (
        <div style={tmColorPickerPopover}>
          <CirclePicker
            width='300px'
            data-testid='circlePicker'
            aria-label='color'
            colors={colorArray(palleteColors)}
            color={color}
            onChange={handleColorChange}
          />
          <button style={tmClose} onClick={handleClose}>
            X
          </button>
        </div>
      )}
    </SpaceBetween>
  );
};
