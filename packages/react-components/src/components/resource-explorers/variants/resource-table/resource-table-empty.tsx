import CloudscapeBox from '@cloudscape-design/components/box';

import type { PluralResourceName } from '../../types/common';

export interface ResourceTableEmptyProps {
  pluralResourceName: PluralResourceName;
}

export function ResourceTableEmpty({
  pluralResourceName,
}: ResourceTableEmptyProps) {
  return (
    <CloudscapeBox textAlign='center'>
      <CloudscapeBox variant='strong'>
        No {pluralResourceName.toLowerCase()}.
      </CloudscapeBox>
    </CloudscapeBox>
  );
}
