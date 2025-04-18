import * as awsui from '@cloudscape-design/design-tokens';

import { colors } from '../../utils/styleUtils';

type ISliderProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Slider: React.FC<ISliderProps> = (props) => {
  return (
    <div
      style={{
        backgroundColor: awsui.colorBackgroundInputDisabled,
        display: 'inline-block',
        accentColor: colors.infoBlue,
      }}
    >
      <input
        data-testid='slider'
        {...props}
        type='range'
        style={{
          width: '186px',
          height: '32px',
          marginLeft: '12px',
          marginRight: '12px',
          display: 'flex',
        }}
      />
    </div>
  );
};
