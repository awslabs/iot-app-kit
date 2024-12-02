import { memo } from 'react';
import { Button, type ButtonProps } from './button';

export type SecondaryButtonProps = Omit<ButtonProps, 'type'>;

export const SecondaryButton = memo((props: SecondaryButtonProps) => {
  return <Button type='secondary' {...props} />;
});
