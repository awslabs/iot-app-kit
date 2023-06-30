import { useCallback, useState } from 'react';
import { CirclePicker } from 'react-color';
import { colors } from '../../../../../utils/styleUtils';
import React from 'react';
import { Button, FormField, Icon, Input, InputProps, SpaceBetween } from '@awsui/components-react';
import { NonCancelableCustomEvent } from '@awsui/components-react/internal/events';
import { useIntl } from 'react-intl';

interface ColorPickerProps {
  color: string;
  selectedColor?: string;
  iconSvg?: string;
  onSelectColor: (color: string) => void;
  label?: string
}
export const ColorPicker = ({ color, onSelectColor, label }: ColorPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors.infoBlue);
  const [hexColor, setHexColor] = useState(currentColor);
  const { formatMessage } = useIntl();
  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const handleColorChange = useCallback(
    (color) => {
      setCurrentColor(color.hex);
      setHexColor(color.hex);
      onSelectColor(color.hex);
    },
    [color],
  );

  const handleHexCodeChange = useCallback((event: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
    setHexColor(event.detail.value);
    onSelectColor(event.detail.value);
  }, []);

  return (
    <SpaceBetween size='m' direction='horizontal'>
      <FormField label={formatMessage({id: 'Colors'})}>
      <Button
        ariaLabel=''
        variant='inline-icon'
        iconSvg={
          <Icon
            size='big'
            svg={
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52' width='52px' height='52px'>
                <g fill={currentColor} fillRule='evenodd' transform='translate(1 1)'>
                  <circle cx='25' cy='25' r='16' fill={currentColor} />
                </g>
              </svg>
            }
          />
        }
        onClick={() => {
          setCurrentColor(color);
          setHexColor(color);
          onSelectColor(color);
          handleClick();
        }}
      />
      <FormField stretch >
        <Input value={hexColor} onChange={handleHexCodeChange} placeholder='Hex code' />
      </FormField>
      {showPicker && (
        <CirclePicker aria-label='color' colors={colors} color={currentColor} onChangeComplete={handleColorChange} />
        )}
        </FormField>
    </SpaceBetween>
  );
};
