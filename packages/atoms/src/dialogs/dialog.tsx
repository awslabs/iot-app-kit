import CloudscapeModal from '@cloudscape-design/components/modal';
import { memo, type PropsWithChildren, type ReactNode } from 'react';

export interface DialogProps extends PropsWithChildren {
  visible: boolean;
  onDismiss: VoidFunction;
  header?: ReactNode;
  footer?: ReactNode;
}

export const Dialog = memo(
  ({ visible, onDismiss, header, footer, children }: DialogProps) => {
    // do not render modal at all if hidden
    if (!visible) return null;

    return (
      <CloudscapeModal
        visible
        closeAriaLabel='Close'
        onDismiss={onDismiss}
        header={header}
        footer={footer}
      >
        {children}
      </CloudscapeModal>
    );
  }
);
