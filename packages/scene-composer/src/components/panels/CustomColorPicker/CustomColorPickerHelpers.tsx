import { Input, InputProps } from '@awsui/components-react';
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import * as awsui from '@awsui/design-tokens';

export type RGB = {
  r: string;
  g: string;
  b: string;
};

/**
 * Converts a hex color to rgb format
 *
 * @param color - Either in form '#XXXXXX' or '#XXX'
 * @returns The rgb version of the color
 */
export const hexToRgb = (color: string): RGB => {
  if (color.length === 7) {
    return {
      r: parseInt(color.substring(1, 3), 16).toString(),
      g: parseInt(color.substring(3, 5), 16).toString(),
      b: parseInt(color.substring(5, 7), 16).toString(),
    };
  } else {
    return {
      r: parseInt(color.at(1)! + color.at(1)!, 16).toString(),
      g: parseInt(color.at(2)! + color.at(2)!, 16).toString(),
      b: parseInt(color.at(3)! + color.at(3)!, 16).toString(),
    };
  }
};

/**
 * Formats a string to look like a hex value.
 *
 * @param value - Any string
 * @returns A string starting with '#' and with all non-hex values removed
 */
export const validateHex = (value: string) => {
  return `#${value.replace(/[^a-fA-F0-9]/g, '').substring(0, 6)}`;
};

/**
 * Checks if a given hex code is valid
 *
 * @param value - Any string
 * @returns True if value is of form '#XXXXXX' or '#XXX', false otherwise
 */
export const isValidHex = (value: string) => {
  const validHexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return validHexRegex.test(value);
};

/**
 * Formats a string to look like a rgb value
 *
 * @param value - Any string
 * @returns A string containing a number between 0-255 with no leading 0's (unless it would be blank otherwise)
 */
export const validateRgbValue = (value: string) => {
  const onlyDigits = value.replace(/\D/g, '');
  return parseInt(onlyDigits) > 255 ? '255' : parseInt(onlyDigits.padStart(1, '0')).toString();
};

//Converts a string in decimal form to a string in hex with two digits
/**
 * Formats a number in a string to hexidemal in a string
 *
 * @param value - A string containing only numeric characters
 * @returns A string containing the hexidecimal equivalent of the input
 */
const decimalToHex = (value: string) => {
  if (value === '') return '00';
  return parseInt(value, 10).toString(16).padStart(2, '0');
};

/**
 * Converts a rgb color to hexidecimal
 *
 * @param rgb - A rgb color
 * @returns The hex version of the color in '#XXXXXX' form
 */
export const RgbToHex = (rgb: RGB) => {
  return `#${decimalToHex(rgb.r) + decimalToHex(rgb.g) + decimalToHex(rgb.b)}`;
};

export const ColorPickerWrapper = styled.div`
  width: auto;
  max-width: 260px;
  padding: 16px;
  border-radius: 12px;
  background: ${awsui.colorBackgroundItemSelected};
  box-shadow: 0 4px 8px black;
`;

export const FlexibleDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px 30px;
`;

export const ColorPreview = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  width: 30px;
  height: 30px;
  border-style: solid;
  border-width: 1px;
  border-radius: 30%;
`;

export const ColorPickerDivider = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  border-color: ${awsui.colorBorderDividerDefault};
  background-color: ${awsui.colorBorderDividerDefault};
  color: ${awsui.colorBorderDividerDefault};
  padding: 0;
`;

interface FixedWidthInputProps extends InputProps {
  width: string;
}

export const FixedWidthInput = forwardRef<InputProps.Ref, FixedWidthInputProps>((props, ref) => {
  return (
    <div style={{ width: props.width }}>
      <Input ref={ref} {...props} />
    </div>
  );
});
