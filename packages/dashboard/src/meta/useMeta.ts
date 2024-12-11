import { useContext } from 'react';
import { MetaContext } from './context';

export function useMeta() {
  return useContext(MetaContext);
}
