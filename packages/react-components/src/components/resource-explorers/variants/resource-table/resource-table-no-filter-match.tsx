import CloudscapeBox from '@cloudscape-design/components/box';
import CloudscapeButton from '@cloudscape-design/components/button';

import type { PluralResourceName } from '../../types/common';

export interface ResourceTableNoFilterMatchProps {
  pluralResourceName: PluralResourceName;
  onClickResetFilter: () => void;
}

export function ResourceTableNoFilterMatch({
  pluralResourceName,
  onClickResetFilter,
}: ResourceTableNoFilterMatchProps) {
  return (
    <CloudscapeBox textAlign='center'>
      <CloudscapeBox margin={{ bottom: 'xs' }}>
        <CloudscapeBox variant='strong'>
          No matching {pluralResourceName.toLowerCase()}.
        </CloudscapeBox>
      </CloudscapeBox>

      <CloudscapeButton onClick={onClickResetFilter}>
        Clear filters
      </CloudscapeButton>
    </CloudscapeBox>
  );
}
