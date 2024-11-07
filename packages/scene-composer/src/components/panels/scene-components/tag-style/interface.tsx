import { type IIconLookup } from '../../../../models/SceneModels';

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
  selectedIcon: IIconLookup;
  onSelectIconChange: (selectedIcon: IIconLookup) => void;
  iconPickerLabel?: string;
  iconFilterText?: string;
  iconFilterTextAriaLabel?: string;
  iconButtonText?: string;
}
