export interface TagStyle {
  colorPicker?: React.ReactNode;
  colorPickerProps?: IColorPickerProps;
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
