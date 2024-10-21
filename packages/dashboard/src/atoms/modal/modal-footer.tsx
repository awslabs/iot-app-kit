import CloudscapeBox from '@cloudscape-design/components/box';
import CloudscapeSpaceBetween from '@cloudscape-design/components/space-between';
import React, { type PropsWithChildren } from 'react';

export type ModalFooterProps = PropsWithChildren;

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <CloudscapeBox float='right'>
      <CloudscapeSpaceBetween direction='horizontal' size='xs'>
        {children}
      </CloudscapeSpaceBetween>
    </CloudscapeBox>
  );
}
