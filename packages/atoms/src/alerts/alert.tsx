import CloudscapeAlert from '@cloudscape-design/components/alert';
import { memo, type PropsWithChildren } from 'react';

export interface AlertProps extends PropsWithChildren {
  type: 'warning' | 'error' | 'success' | 'info';
}

export const Alert = memo(({ type, children }: AlertProps) => {
  return (
    <CloudscapeAlert type={type} statusIconAriaLabel={`${type} alert`}>
      {children}
    </CloudscapeAlert>
  );
});
