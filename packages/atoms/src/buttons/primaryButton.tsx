import { memo } from 'react';
import { Button, type ButtonProps } from './button';

export type PrimaryButtonProps = Omit<ButtonProps, 'type'>;

export const PrimaryButton = memo((props: PrimaryButtonProps) => {
  return <Button type='primary' {...props} />;
});
