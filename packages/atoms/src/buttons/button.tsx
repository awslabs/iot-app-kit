import CloudscapeButton, { type ButtonProps as CloudscapeButtonProps } from '@cloudscape-design/components/button';
import { memo, useMemo, type PropsWithChildren } from 'react';

export type ButtonType = 'primary' | 'secondary' | 'tertiary'

export interface ButtonProps extends PropsWithChildren {
  type?: ButtonType;
  disabled?: boolean;
  iconName?: NonNullable<CloudscapeButtonProps['iconName']>;
  ariaLabel?: string;
  onClick: VoidFunction;
}

export const Button = memo(
  ({ type = 'primary', disabled, iconName, ariaLabel, onClick, children }: ButtonProps) => {
    const variant = useMemo(() => mapTypeToVariant(type), []);

    return (
      <CloudscapeButton 
        variant={variant} 
        disabled={disabled} 
        iconName={iconName} 
        ariaLabel={ariaLabel} 
        formAction='none' 
        onClick={onClick}
      >
        {children}
      </CloudscapeButton>
    );
  }
);

function mapTypeToVariant(type: ButtonType): NonNullable<CloudscapeButtonProps['variant']> {
  switch (type) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'normal';
    case 'tertiary':
      return 'link';
  }
}
