import { SpaceBetween } from '@cloudscape-design/components';
import debounce from 'lodash-es/debounce';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { type ColorRepresentation } from 'three';
import {
  ColorPickerWrapper,
  DEFAULT_COLOR,
  FlexibleDiv,
  getRgb,
  HexInputField,
  hexString,
  isValidColor,
  ReactColorfulPicker,
  RgbInputField,
  updateColorWithRgb,
  validateHex,
  validateRgbValue,
} from './ColorPickerHelpers';

interface ColorPickerProps {
  color: ColorRepresentation | undefined;
  onChange: (newColor: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }: ColorPickerProps) => {
  const { formatMessage } = useIntl();
  const [internalColor, setInternalColor] = useState<ColorRepresentation>(color ? color : DEFAULT_COLOR);
  const [hexInputValue, setHexInputValue] = useState<string>(color ? hexString(color) : hexString(DEFAULT_COLOR));

  const handleColorfulChange = (newColor: ColorRepresentation) => {
    setInternalColor(newColor);
    setHexInputValue(hexString(newColor));
    onChange(hexString(newColor));
  };

  const handleHexChange = (newColor: string) => {
    setHexInputValue(validateHex(newColor));
    if (isValidColor(newColor)) {
      setInternalColor(newColor);
      onChange(newColor);
    }
  };

  const handleRGBChange = (newValue) => {
    const updatedColor = updateColorWithRgb(internalColor, newValue);
    setInternalColor(updatedColor);
    setHexInputValue(updatedColor);
    onChange(updatedColor);
  };

  return (
    <ColorPickerWrapper>
      <form onSubmit={(e) => e.preventDefault()}>
        <ReactColorfulPicker color={hexString(internalColor)} onChange={debounce(handleColorfulChange, 100)} />
        <FlexibleDiv>
          <HexInputField
            color={`#${hexInputValue.replace('#', '')}`}
            onChange={(e) => handleHexChange(e.detail.value)}
            label={formatMessage({ defaultMessage: 'Hex', description: 'Abbreviation for hexidecimal' })}
            errorText={
              !isValidColor(hexInputValue) &&
              formatMessage({ defaultMessage: 'Invalid Hex', description: 'Form field error message' })
            }
          />
          <SpaceBetween size='xs' direction='horizontal'>
            <RgbInputField
              value={getRgb(internalColor).r.toString()}
              label={formatMessage({ defaultMessage: 'R', description: 'Abbreviation for red' })}
              onChange={(e) => handleRGBChange({ r: validateRgbValue(e.detail.value) })}
              testId='rule-color-selector-red'
            />
            <RgbInputField
              value={getRgb(internalColor).g.toString()}
              label={formatMessage({ defaultMessage: 'G', description: 'Abbreviation for green' })}
              onChange={(e) => handleRGBChange({ g: validateRgbValue(e.detail.value) })}
              testId='rule-color-selector-green'
            />
            <RgbInputField
              value={getRgb(internalColor).b.toString()}
              label={formatMessage({ defaultMessage: 'B', description: 'Abbreviation for blue' })}
              onChange={(e) => handleRGBChange({ b: validateRgbValue(e.detail.value) })}
              testId='rule-color-selector-blue'
            />
          </SpaceBetween>
        </FlexibleDiv>
      </form>
    </ColorPickerWrapper>
  );
};
