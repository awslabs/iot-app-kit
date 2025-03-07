import { StringSettingInputField } from '~/features/widget-customization/atoms/text-input';

export interface TitleFieldProps {
  title?: string | undefined;
  setTitle: (title?: string | undefined) => void;
}

export const TitleField = ({ title, setTitle }: TitleFieldProps) => {
  return (
    <StringSettingInputField
      label='Title'
      placeholderText='Input title'
      settingValue={title}
      setSettingValue={setTitle}
    />
  );
};
