import { useContext } from 'react';
import { ViewportContext } from '../../components/time-sync';

export const useViewport = () => {
  return useContext(ViewportContext);
};
