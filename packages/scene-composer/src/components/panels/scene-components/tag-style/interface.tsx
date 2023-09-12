import { IconLookup } from '@fortawesome/fontawesome-svg-core';

export interface TagStyle {
  colorPicker?: React.ReactNode;
  colorPickerProps?: IColorPickerProps;
  iconPicker?: React.ReactNode;
  iconPickerProps?: IIconPicker;
}

export interface IColorPickerProps {
  color: string;
  onSelectColor: (color: string) => void;
  iconSvg?: string;
  colorPickerLabel?: string;
  customColorLabel?: string;
  customColors?: string[];
  onUpdateCustomColors?: (customColors: string[]) => void;
}

export interface IIconPicker {
  selectedIcon: IconLookup;
  onSelectIconChange: (selectedIcon: string) => void;
  iconPickerLabel?: string;
  iconFilterText?: string;
  iconFilterTextAriaLabel?: string;
}
