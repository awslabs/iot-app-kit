import { DateFilterForm } from "../components/date-filter-form";
import type { PropertyFilterProps } from "@cloudscape-design/components/property-filter";

type FilterProperty = PropertyFilterProps["filteringProperties"][0];

type CreateFilterPropertyInput = Pick<
  FilterProperty,
  "key" | "propertyLabel" | "groupValuesLabel"
>;

export function createStringFilterProperty(
  input: CreateFilterPropertyInput
): FilterProperty {
  return {
    key: input.key,
    propertyLabel: input.propertyLabel,
    groupValuesLabel: input.groupValuesLabel,
    operators: ["=", "!=", ":", "!:"],
  };
}

export function createDateFilterProperty(
  input: CreateFilterPropertyInput
): FilterProperty {
  return {
    key: input.key,
    propertyLabel: input.propertyLabel,
    groupValuesLabel: input.groupValuesLabel,
    operators: (["=", "!=", "<", "<=", ">", ">="] as const).map((operator) => ({
      operator: operator,
      form: DateFilterForm,
      format: (tokenValue) => tokenValue,
      match: "date",
    })),
  };
}
