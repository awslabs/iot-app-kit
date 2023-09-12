import React, { useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { debounce } from 'lodash';
import { Button, FormField, InputProps, SpaceBetween } from '@awsui/components-react';
import './CustomColorPicker.scss';
import { useIntl } from 'react-intl';

import {
  ColorPickerDivider,
  ColorPickerWrapper,
  ColorPreview,
  FlexibleDiv,
  RGB,
  RgbToHex,
  hexToRgb,
  isValidHex,
  validateHex,
  validateRgbValue,
  FixedWidthInput,
} from './colorPickerHelpers';

export const DEFAULT_COLOR_PICKER_COLOR = {
  hex: '#ffffff',
  rgb: {
    r: '255',
    g: '255',
    b: '255',
  },
};

interface CustomColorPickerProps {
  color: string | undefined;
  onSubmit: (newColor: string) => void;
  onCancel?: () => void;
}

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  color,
  onSubmit,
  onCancel,
}: CustomColorPickerProps) => {
  const { formatMessage } = useIntl();
  const hexInputFieldRef = useRef<InputProps.Ref>(null);
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [internalColor, setInternalColor] = useState<string>(() =>
    !!color && isValidHex(color) ? color : DEFAULT_COLOR_PICKER_COLOR.hex,
  );
  const [hexInputValue, setHexInputValue] = useState<string>(() =>
    !!color && isValidHex(color) ? color : DEFAULT_COLOR_PICKER_COLOR.hex,
  );
  const [rgbInputValue, setRgbInputValue] = useState<RGB>(() => {
    return !!color && isValidHex(color)
      ? {
          r: parseInt(color.substring(1, 3), 16).toString(),
          g: parseInt(color.substring(3, 5), 16).toString(),
          b: parseInt(color.substring(5, 7), 16).toString(),
        }
      : DEFAULT_COLOR_PICKER_COLOR.rgb;
  });

  const handleColorfulChange = (newColor: string) => {
    setInternalColor(newColor);
    setHexInputValue(newColor);
    setRgbInputValue(hexToRgb(newColor));
  };

  const handleHexChange = (newColor: string) => {
    setHexInputValue(validateHex(newColor));
    if (isValidHex(newColor)) {
      setInternalColor(newColor);
      setRgbInputValue(hexToRgb(newColor));
    }
  };

  const handleRGBChange = (newValue: Partial<RGB>) => {
    setRgbInputValue({ ...rgbInputValue, ...newValue });
    setHexInputValue(RgbToHex({ ...rgbInputValue, ...newValue }));
    setInternalColor(RgbToHex({ ...rgbInputValue, ...newValue }));
  };

  const onSubmitAttempt = () => {
    setSaveAttempted(true);
    //The hex input is the only field that could conceivably be invalid
    const valid = isValidHex(hexInputValue);
    if (valid) {
      onSubmit(internalColor);
    } else {
      hexInputFieldRef.current?.focus();
    }
  };

  return (
    <ColorPickerWrapper>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className='color-picker' data-testid='react-colorful-picker'>
          <HexColorPicker color={internalColor} onChange={debounce(handleColorfulChange, 100)} />
        </div>

        <SpaceBetween size='s'>
          <FlexibleDiv>
            <FormField
              label={formatMessage({ defaultMessage: 'Hex', description: 'Abbreviation for hexidecimal' })}
              errorText={
                !isValidHex(hexInputValue) &&
                saveAttempted &&
                formatMessage({ defaultMessage: 'Invalid Hex', description: 'Form field error message' })
              }
              data-testid='hex-input-form-field'
            >
              <div role='status'>
                <FixedWidthInput
                  //only makes sense if this component can be expanded and collapsed, which is when it has the cancel button
                  // TODO: add color swatch to light component, then we can autofocus always
                  autoFocus={!!onCancel}
                  width='75px'
                  value={`#${hexInputValue.replace('#', '')}`}
                  onChange={(e) => handleHexChange(e.detail.value)}
                  ref={hexInputFieldRef}
                  data-testid='hex-input'
                />
              </div>
            </FormField>
            <SpaceBetween size='xs' direction='horizontal'>
              <FormField label={formatMessage({ defaultMessage: 'R', description: 'Abbreviation for red' })}>
                <div role='status'>
                  <FixedWidthInput
                    width='42px'
                    value={rgbInputValue.r}
                    onChange={(e) => handleRGBChange({ r: validateRgbValue(e.detail.value) })}
                    data-testid='red-input'
                  />
                </div>
              </FormField>
              <FormField label={formatMessage({ defaultMessage: 'G', description: 'Abbreviation for green' })}>
                <div role='status'>
                  <FixedWidthInput
                    width='42px'
                    value={rgbInputValue.g}
                    onChange={(e) => handleRGBChange({ g: validateRgbValue(e.detail.value) })}
                    data-testid='green-input'
                  />
                </div>
              </FormField>
              <FormField label={formatMessage({ defaultMessage: 'B', description: 'Abbreviation for blue' })}>
                <div role='status'>
                  <FixedWidthInput
                    width='42px'
                    value={rgbInputValue.b}
                    onChange={(e) => handleRGBChange({ b: validateRgbValue(e.detail.value) })}
                    data-testid='blue-input'
                  />
                </div>
              </FormField>
            </SpaceBetween>
          </FlexibleDiv>

          <ColorPickerDivider />

          <FlexibleDiv>
            <ColorPreview backgroundColor={internalColor} />
            <SpaceBetween size='xs' direction='horizontal'>
              {!!onCancel && (
                <Button variant='link' onClick={onCancel} formAction='none' data-testid='color-picker-cancel-button'>
                  {formatMessage({ defaultMessage: 'Cancel', description: 'Cancel button' })}
                </Button>
              )}

              <Button variant='normal' onClick={onSubmitAttempt} data-testid='color-picker-save-button'>
                {formatMessage({ defaultMessage: 'Save', description: 'Save button' })}
              </Button>
            </SpaceBetween>
          </FlexibleDiv>
        </SpaceBetween>
      </form>
    </ColorPickerWrapper>
  );
};
