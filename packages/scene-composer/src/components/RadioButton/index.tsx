import { type FC } from 'react';

import './radio-button.scss';

export interface RadioButtonProps {
  checked?: boolean;
  label?: string;
  selected?: boolean;
  testId?: string;
  toggle: (e: any) => void;
}

const RadioButton: FC<RadioButtonProps> = ({ label, selected, testId, toggle }) => {
  return <input checked={selected} data-testid={testId} onChange={toggle} type='radio' value={label} />;
};

RadioButton.displayName = 'RadioButton';

export default RadioButton;
