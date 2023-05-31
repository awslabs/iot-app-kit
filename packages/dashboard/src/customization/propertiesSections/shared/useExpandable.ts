import { useState } from 'react';

export const useExpandable = (defaultExpanded = true) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return [expanded, setExpanded] as const;
};
