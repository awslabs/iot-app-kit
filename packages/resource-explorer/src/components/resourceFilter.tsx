import PropertyFilter from "@cloudscape-design/components/property-filter";
import { useState } from "react";

import type { PropertyFilterProps } from '@cloudscape-design/components/property-filter';

export function ResourceFilter() {
  const [query, setQuery] = useState<PropertyFilterProps['query']>({
    tokens: [],
    operation: "and"
  })

  return (
    <PropertyFilter
      onChange={({ detail }) => setQuery(detail)}
      query={query}
      filteringProperties={[]} 
      i18nStrings={{
        filteringAriaLabel: "Resource filter",
        filteringPlaceholder: "Filter resources",
      }}
    />
  )
}