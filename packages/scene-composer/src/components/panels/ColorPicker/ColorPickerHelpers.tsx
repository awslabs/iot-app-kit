import { FormField, Input, type InputProps } from '@cloudscape-design/components';
import { HexColorPicker } from 'react-colorful';
import { type ColorRepresentation } from 'three';
import tinycolor, { type Color } from 'tinycolor2';
import './ColorPicker.scss';

export const DEFAULT_COLOR = new tinycolor().toHexString();

const toTinyColor = (color: ColorRepresentation): string | Color => {
  return typeof color === 'number' ? new tinycolor(color.toString(16)) : new tinycolor(color);
};

export const hexString = (color: ColorRepresentation): string => {
  return toTinyColor(color).toHexString();
};

export const updateColorWithRgb = (oldColor: ColorRepresentation, newValue: { ColorRepresentation }) => {
  return new tinycolor({ ...toTinyColor(oldColor).toRgb(), ...newValue }).toHexString();
};

export const isValidColor = (color: ColorRepresentation): boolean => {
  return toTinyColor(color).isValid() && toTinyColor(color).getFormat() === 'hex';
};

export const validateHex = (value: string): string => {
  return `#${value.replace(/[^a-fA-F0-9]/g, '').substring(0, 6)}`;
};

export const getRgb = (color: ColorRepresentation) => {
  return toTinyColor(color).toRgb();
};

export const validateRgbValue = (value: string): string => {
  const maxRgbValue = 0xff; //Maximum possible value representable by 2 bytes
  const onlyDigits = value.replace(/\D/g, '');
  if (value === '-1') return '0'; //manually handle decreasing from 0
  return parseInt(onlyDigits) > maxRgbValue ? maxRgbValue.toString() : parseInt(onlyDigits.padStart(1, '0')).toString();
};

export const ColorPickerWrapper: React.FC<React.PropsWithChildren> = ({ children }: React.PropsWithChildren) => {
  return <div className='color-picker-wrapper'>{children}</div>;
};

export const FlexibleDiv: React.FC<React.PropsWithChildren> = ({ children }: React.PropsWithChildren) => {
  return <div className='flexible-div'>{children}</div>;
};

interface ReactColorfulPickerProps {
  color: string;
  onChange: ((newColor: string) => void) | undefined;
}

export const ReactColorfulPicker: React.FC<ReactColorfulPickerProps> = ({
  color,
  onChange,
}: ReactColorfulPickerProps) => {
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

interface HexInputFieldProps {
  color: string;
  onChange: NonNullable<InputProps['onChange']>;
  label: string;
  errorText: string | boolean;
}

export const HexInputField: React.FC<HexInputFieldProps> = ({
  color,
  onChange,
  label,
  errorText,
}: HexInputFieldProps) => {
  return (
    <FormField label={label} errorText={errorText}>
      <FixedWidthInput width='6em' value={color} onChange={onChange} data-testid='rule-color-selector-hex' />
    </FormField>
  );
};

interface RgbInputFieldProps {
  value: string;
  onChange: NonNullable<InputProps['onChange']>;
  label: string;
  testId: string;
}

export const RgbInputField: React.FC<RgbInputFieldProps> = ({ value, onChange, label, testId }: RgbInputFieldProps) => {
  return (
    <FormField label={label}>
      <FixedWidthInput
        width='4.3em'
        inputMode='numeric'
        type='number'
        value={value}
        onChange={onChange}
        data-testid={testId}
      />
    </FormField>
  );
};
