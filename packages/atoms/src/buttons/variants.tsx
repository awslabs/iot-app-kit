import { memo } from 'react';
import { Button, type ButtonProps } from './button';
import type { Except, SetOptional, SetRequired } from 'type-fest';

export type PrimaryButtonProps = Except<ButtonProps, 'type'>;
export const PrimaryButton = memo((props: PrimaryButtonProps) => {
  return <Button type='primary' {...props} />;
});

export type SecondaryButtonProps = Except<ButtonProps, 'type'>;
export const SecondaryButton = memo((props: SecondaryButtonProps) => {
  return <Button type='secondary' {...props} />;
});

export type TertiaryButtonProps = Except<ButtonProps, 'type'>;
export const TertiaryButton = memo((props: TertiaryButtonProps) => {
  return <Button type='tertiary' {...props} />;
});

export type IconButtonProps = SetOptional<
  SetRequired<
    ButtonProps,
    'iconName' | 'ariaLabel' // All icon buttons should have aria-label/title attributes set.
  >,
  'type' // Icons are useful in all button types. Default to icon type.
>;
export const IconButton = memo((props: IconButtonProps) => {
  return <Button type='icon' {...props} />;
});
