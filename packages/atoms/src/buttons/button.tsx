import CloudscapeButton, {
  type ButtonProps as CloudscapeButtonProps,
} from '@cloudscape-design/components/button';
import { memo, type PropsWithChildren } from 'react';

export type IconName = Extract<
  NonNullable<CloudscapeButtonProps['iconName']>,
  'angle-down' | 'angle-left' | 'angle-right' | 'settings'
>;

export interface ButtonProps extends PropsWithChildren {
  type: 'primary' | 'secondary' | 'tertiary' | 'icon';
  ariaLabel?: string;
  iconName?: IconName;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onClick: VoidFunction;
}

export const Button = memo(
  ({
    type,
    ariaLabel,
    iconName,
    disabled,
    loading,
    loadingText,
    onClick,
    children,
  }: ButtonProps) => {
    const variant = mapTypeToVariant(type);

    return (
      <CloudscapeButton
        variant={variant}
        disabled={disabled || loading}
        loading={loading}
        loadingText={loadingText}
        onClick={onClick}
        iconName={iconName}
        ariaLabel={ariaLabel}
      >
        {children}
      </CloudscapeButton>
    );
  }
);

function mapTypeToVariant(
  type: ButtonProps['type']
): NonNullable<CloudscapeButtonProps['variant']> {
  switch (type) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'normal';
    case 'tertiary':
      return 'link';
    case 'icon':
      return 'icon';
  }
}
