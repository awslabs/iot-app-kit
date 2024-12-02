import { memo } from 'react';
import { Button, type ButtonProps } from './button';

export type TertiaryButtonProps = Omit<ButtonProps, 'type'>;

export const TertiaryButton = memo((props: TertiaryButtonProps) => {
  return <Button type='tertiary' {...props} />;
});
