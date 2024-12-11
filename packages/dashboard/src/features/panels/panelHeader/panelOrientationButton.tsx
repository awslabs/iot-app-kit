import CloudscapeButtonDropdown, {
  type ButtonDropdownProps as CloudscapeButtonDropdownProps,
} from '@cloudscape-design/components/button-dropdown';
import { memo, useCallback, useMemo } from 'react';
import { type PanelOrientation } from '../store';
import { useOrientation } from '../useOrientation';

export const PanelOrientationButton = memo(() => {
  const [orientation, setOrientation] = useOrientation();

  const handleChangeOrientation = useCallback(
    ({
      detail: { id },
    }: Parameters<
      NonNullable<CloudscapeButtonDropdownProps['onItemClick']>
    >[0]) => {
      setOrientation(id as PanelOrientation);
    },
    [setOrientation]
  );

  const items: CloudscapeButtonDropdownProps['items'] = useMemo(() => {
    return [
      {
        id: 'right',
        text: 'Right',
        itemType: 'checkbox',
        checked: orientation === 'right',
      },
      {
        id: 'left',
        text: 'Left',
        itemType: 'checkbox',
        checked: orientation === 'left',
      },
      {
        id: 'bottom',
        text: 'Bottom',
        itemType: 'checkbox',
        checked: orientation === 'bottom',
      },
    ];
  }, [orientation]);

  return (
    <CloudscapeButtonDropdown
      variant='icon'
      items={items}
      onItemClick={handleChangeOrientation}
    />
  );
});
