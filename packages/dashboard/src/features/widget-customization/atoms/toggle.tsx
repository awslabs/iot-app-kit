import {
  colorBorderItemFocused,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import {
  useCallback,
  useMemo,
  useState,
  type FocusEvent,
  type PropsWithChildren,
  type CSSProperties,
} from 'react';

export interface ToggleButtonProps extends PropsWithChildren {
  toggled: boolean;
  onToggle: VoidFunction;
}

export function ToggleButton({
  toggled,
  onToggle,
  children,
}: ToggleButtonProps) {
  const [tabFocus, setTabFocus] = useState<boolean>(false);

  const handleTabFocus = useCallback((event: FocusEvent<HTMLButtonElement>) => {
    if (event.nativeEvent.type === 'focusin') {
      setTabFocus(true);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setTabFocus(false);
  }, []);

  const style = useMemo(
    () => (tabFocus ? focusStyle : {}) satisfies CSSProperties,
    [tabFocus]
  );

  return (
    <button
      role='checkbox'
      aria-checked={toggled}
      className={`text-button-toggle ${toggled ? 'checked' : ''}`}
      style={style}
      onClick={onToggle}
      onFocus={handleTabFocus}
      onBlur={handleBlur}
    >
      {children}
    </button>
  );
}

const focusStyle = {
  outline: `${spaceStaticXxxs} solid ${colorBorderItemFocused}`,
  outlineStyle: 'auto',
} satisfies CSSProperties;
