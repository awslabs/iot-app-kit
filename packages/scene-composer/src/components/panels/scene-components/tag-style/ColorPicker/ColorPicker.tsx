import { useCallback, useState } from 'react';
import { CirclePicker } from 'react-color';
import { colors } from '../../../../../utils/styleUtils';
import React from 'react';
import { Button, Icon, Input, InputProps, SpaceBetween } from '@awsui/components-react';
import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';
import { useIntl } from 'react-intl';

interface IColorPickerProps {
  color: string;
  selectedColor?: string;
  iconSvg?: string;
  onSelectColor: (color: string) => void;
  label?: string
}
export const ColorPicker = ({ color, onSelectColor, label }: IColorPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  // const [currentColor, setCurrentColor] = useState(color);
  // const [hexColor, setHexColor] = useState(currentColor);
  const [currentColor, setCurrentColor] = useState(color);
  const [hexColor, setHexColor] = useState(currentColor);
  const { formatMessage } = useIntl();
  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const handleColorChange = useCallback(
    (color) => {
      onSelectColor(color.hex);
    },
    [color],
  );

  const handleHexCodeChange = useCallback((event: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
    onSelectColor(event.detail.value);
  }, []);

  return (
    <SpaceBetween size='m' direction='horizontal'>
      <Button
        ariaLabel=''
        variant='inline-icon'
        iconSvg={
          <Icon
            size='big'
            svg={
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52' width='52px' height='52px'>
                <g fill={color} fillRule='evenodd' transform='translate(1 1)'>
                  <circle cx='25' cy='25' r='16' fill={color} />
                </g>
              </svg>
            }
          />
        }
        onClick={() => {
          onSelectColor(color);
          handleClick();
        }}
      />
        <Input value={color} onChange={handleHexCodeChange} placeholder='Hex code' />
        <Input value={hexColor} onChange={handleHexCodeChange} placeholder='Hex code' />
      {showPicker && (
        <CirclePicker aria-label='color' colors={colors} color={color} onChangeComplete={handleColorChange} />
        )}
    </SpaceBetween>
  );
};
