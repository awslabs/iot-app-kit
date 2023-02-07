import { useContext } from 'react';
import { ViewportContext } from '../../components/viewport-manager';

export const useViewport = () => {
  return useContext(ViewportContext);
};
