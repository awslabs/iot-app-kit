import { useDispatch, useSelector } from 'react-redux';
import type { Dispatch, RootState } from './types';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useStoreDispatch = useDispatch.withTypes<Dispatch>();
export const useStoreSelector = useSelector.withTypes<RootState>();
