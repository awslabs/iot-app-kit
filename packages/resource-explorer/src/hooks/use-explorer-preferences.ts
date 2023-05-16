import useLocalStorage from "react-use/lib/useLocalStorage";
import type { CollectionPreferencesProps } from "@cloudscape-design/components/collection-preferences";

const DEFAULT_PREFERENCES = {
  pageSize: 10,
  wrapLines: true,
  stripedRows: false,
} as const satisfies CollectionPreferencesProps["preferences"];

interface UseExplorerPreferencesProps {
  defaultVisibleContent: string[];
  storageKey: string;
}

export function useExplorerPreferences(props: UseExplorerPreferencesProps) {
  const initializer = {
    ...DEFAULT_PREFERENCES,
    visibleContent: props.defaultVisibleContent,
  };

  const [preferences = initializer, setPreferences] = useLocalStorage(
    props.storageKey,
    initializer
  );

  return [preferences, setPreferences] as const;
}
