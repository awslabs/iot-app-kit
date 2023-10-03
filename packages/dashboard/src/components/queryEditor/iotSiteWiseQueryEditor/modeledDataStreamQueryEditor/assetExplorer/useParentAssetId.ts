import { useState } from 'react';

export function useParentAssetId() {
  return useState<string | undefined>(undefined);
}
