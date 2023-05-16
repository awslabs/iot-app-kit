import React from "react";
import FormField from "@cloudscape-design/components/form-field";
import Select, { type SelectProps } from "@cloudscape-design/components/select";

type Option = NonNullable<SelectProps["options"]>[number];

export const DATA_STREAM_TYPE_OPTIONS = [
  { label: "All", value: "ALL", description: "All data streams" },
  {
    label: "Modeled",
    value: "MODELED",
    description: "Modeled data streams",
  },
  {
    label: "Unmodeled",
    value: "UNMODELED",
    description: "Unmodeled data streams",
  },
] as const satisfies Readonly<Option[]>;

interface DataStreamTypeSelectProps {
  selectedOption: (typeof DATA_STREAM_TYPE_OPTIONS)[number];
  onChange: (option: Option) => void;
}

export function DataStreamTypeSelect(props: DataStreamTypeSelectProps) {
  return (
    <FormField
      label="Data stream type"
      description="Select the type of data stream you want to view."
    >
      <Select
        selectedOption={props.selectedOption}
        onChange={({ detail }) => props.onChange(detail.selectedOption)}
        options={DATA_STREAM_TYPE_OPTIONS}
      />
    </FormField>
  );
}
