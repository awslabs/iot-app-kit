import CloudscapeBox from '@cloudscape-design/components/box';
import CloudscapeSpaceBetween from '@cloudscape-design/components/space-between';
import { memo, type PropsWithChildren } from 'react';

export type DialogFooterProps = PropsWithChildren;

export const DialogFooter = memo(({ children }: DialogFooterProps) => {
  return (
    <CloudscapeBox float='right'>
      <CloudscapeSpaceBetween direction='horizontal' size='xs'>
        {children}
      </CloudscapeSpaceBetween>
    </CloudscapeBox>
  );
});
