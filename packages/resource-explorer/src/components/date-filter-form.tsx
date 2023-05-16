import Box from "@cloudscape-design/components/box";
import Calendar from "@cloudscape-design/components/calendar";
import DateInput from "@cloudscape-design/components/date-input";
import FormField from "@cloudscape-design/components/form-field";
import React from "react";

interface DateFilterFormProps {
  value?: string;
  onChange: (value: string) => void;
}

export function DateFilterForm({ value, onChange }: DateFilterFormProps) {
  return (
    <Box>
      <FormField>
        <DateInput
          value={value ?? ""}
          onChange={(event) => onChange(event.detail.value)}
          placeholder="YYYY/MM/DD"
        />
      </FormField>
      <Calendar
        value={value ?? ""}
        onChange={(event) => onChange(event.detail.value)}
        locale="en-EN"
        todayAriaLabel="Today"
        nextMonthAriaLabel="Next month"
        previousMonthAriaLabel="Previous month"
      />
    </Box>
  );
}
