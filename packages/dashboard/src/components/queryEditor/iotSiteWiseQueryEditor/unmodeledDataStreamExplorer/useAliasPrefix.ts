import { useState } from 'react';

export function useAliasPrefix() {
  const [aliasPrefix, setAliasPrefix] = useState<string | undefined>();

  return [aliasPrefix, setAliasPrefix] as const;
}
