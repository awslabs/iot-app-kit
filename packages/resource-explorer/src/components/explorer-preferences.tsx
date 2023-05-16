import CollectionPreferences, {
  type CollectionPreferencesProps,
} from "@cloudscape-design/components/collection-preferences";
import React from "react";

interface ExplorerPreferencesProps
  extends Pick<CollectionPreferencesProps, "preferences" | "onConfirm"> {
    visibleContentOptions: NonNullable<
      CollectionPreferencesProps["visibleContentPreference"]
    >["options"];
}

export function ExplorerPreferences(props: ExplorerPreferencesProps) {
  return (
    <CollectionPreferences
      title="Preferences"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      preferences={props.preferences}
      onConfirm={props.onConfirm}
      pageSizePreference={{
        title: "Select page size",
        options: [
          { value: 10, label: "10" },
          { value: 25, label: "25" },
          { value: 100, label: "100" },
          { value: 250, label: "250" },
        ],
      }}
      wrapLinesPreference={{
        label: "Wrap lines",
        description: "Select to see all the text and wrap the lines",
      }}
      stripedRowsPreference={{
        label: "Striped rows",
        description: "Select to add alternating shaded rows",
      }}
      visibleContentPreference={{
        title: "Select visible content",
        options: props.visibleContentOptions,
      }}
    />
  );
}
