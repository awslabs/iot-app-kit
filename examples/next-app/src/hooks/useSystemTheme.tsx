import { useEffect, useState } from "react";

const useSystemTheme = () : 'Light' | 'Dark' => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const [sysTheme, setSysTheme] = useState<'Light' | 'Dark'>(prefersDark ? 'Dark' : 'Light');

    useEffect(() => {
        const onThemeChanged = ({ matches }: MediaQueryListEvent) => {
            if (matches) {
                setSysTheme('Dark')
            } else {
                setSysTheme('Light');
            }
        };

        window.matchMedia('(prefers-color-scheme: dark)')
              .addEventListener('change', onThemeChanged, { passive: true });

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)')
              .removeEventListener('change', onThemeChanged);
        }
    });

    return sysTheme;
}

export default useSystemTheme;
