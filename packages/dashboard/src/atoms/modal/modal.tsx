import CloudscapeModal from '@cloudscape-design/components/modal';
import React, { type PropsWithChildren, type ReactNode } from 'react';

export interface ModalProps extends PropsWithChildren {
  visible: boolean;
  onDismiss: VoidFunction;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  visible,
  onDismiss,
  header,
  footer,
  children,
}: ModalProps) {
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
