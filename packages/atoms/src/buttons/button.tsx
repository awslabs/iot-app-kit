import CloudscapeButton from '@cloudscape-design/components/button';
import { memo, type PropsWithChildren } from 'react';

export interface ButtonProps extends PropsWithChildren {
  type: 'primary';
  onClick: VoidFunction;
}

export const Button = memo(({ type, onClick, children }: ButtonProps) => {
  return (
    <CloudscapeButton variant={type} onClick={onClick}>
      {children}
    </CloudscapeButton>
  );
});
