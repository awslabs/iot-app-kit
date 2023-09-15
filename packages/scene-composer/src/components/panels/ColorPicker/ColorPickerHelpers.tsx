import React from 'react';
import { FormField, Input, InputProps } from '@awsui/components-react';
import './ColorPicker.scss';

import { ColorRepresentation } from 'three';
import tinycolor from 'tinycolor2';
import { HexColorPicker } from 'react-colorful';

export const DEFAULT_COLOR = new tinycolor().toHexString();

const toTinyColor = (color: ColorRepresentation) => {
  return typeof color === 'number' ? new tinycolor(color.toString(16)) : new tinycolor(color);
};

export const hexString = (color: ColorRepresentation) => {
  return toTinyColor(color).toHexString();
};

export const updateColorWithRgb = (oldColor: ColorRepresentation, newValue) => {
  return new tinycolor({ ...toTinyColor(oldColor).toRgb(), ...newValue }).toHexString();
};

export const isValidColor = (color: ColorRepresentation) => {
  return toTinyColor(color).isValid() && toTinyColor(color).getFormat() === 'hex';
};

export const validateHex = (value: string) => {
  return `#${value.replace(/[^a-fA-F0-9]/g, '').substring(0, 6)}`;
};

export const getRgb = (color: ColorRepresentation) => {
  return toTinyColor(color).toRgb();
};

export const validateRgbValue = (value: string) => {
  const onlyDigits = value.replace(/\D/g, '');
  return parseInt(onlyDigits) > 255 ? '255' : parseInt(onlyDigits.padStart(1, '0')).toString();
};

export const ColorPickerWrapper = ({ children }) => {
  return <div className='color-picker-wrapper'>{children}</div>;
};

export const FlexibleDiv = ({ children }) => {
  return <div className='flexible-div'>{children}</div>;
};

export const ReactColorfulPicker = ({ color, onChange }) => {
  return (
    <div className='color-picker'>
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
};

interface FixedWidthInputProps extends InputProps {
  width: string;
}

const FixedWidthInput: React.FC<FixedWidthInputProps> = (props) => {
  return (
    <div style={{ width: props.width }} role='status'>
      <Input {...props} />
    </div>
  );
};

export const HexInputField = ({ color, onChange, label, errorText }) => {
  return (
    <FormField label={label} errorText={errorText}>
      <FixedWidthInput
        width='75px'
        value={color}
        onChange={onChange}
        inputMode='numeric'
        data-testid='rule-color-selector-hex'
      />
    </FormField>
  );
};

export const RgbInputField = ({ value, onChange, label, testId }) => {
  return (
    <FormField label={label}>
      <FixedWidthInput width='42px' value={value} onChange={onChange} data-testid={testId} />
    </FormField>
  );
};
