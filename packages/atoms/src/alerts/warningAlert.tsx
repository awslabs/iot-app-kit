import { memo } from 'react';
import { Alert, type AlertProps } from './alert';

export type WarningAlertProps = Omit<AlertProps, 'type'>;

export const WarningAlert = memo((props: WarningAlertProps) => {
  return <Alert type='warning' {...props} />;
});
