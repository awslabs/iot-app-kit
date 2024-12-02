import { memo } from 'react';
import type { Except, SetRequired } from 'type-fest';
import { Button, type ButtonProps } from './button';

// TODO: update props to support iconname OR custom icon

export type IconButtonProps = Except<SetRequired<ButtonProps, 'iconName' | 'ariaLabel'>, 'children'>;

export const IconButton = memo((props: IconButtonProps) => {
  return <Button {...props} />;
});
