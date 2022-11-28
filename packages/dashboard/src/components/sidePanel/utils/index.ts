import { useEffect, Dispatch, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { get, set, cloneDeep } from 'lodash';

export const useInput: <T>(path: string) => [T, Dispatch<T>] = (path) => {
  const selectedWidget = {}; // TODO: get selected widget from state manager or context
  const [value, updateValue] = useState(get(selectedWidget, path));
  // const dispatch = useDispatch();
  useEffect(() => {
    if (selectedWidget && get(selectedWidget, path) !== value) {
      const deepClone = cloneDeep(selectedWidget);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newWidget = set(deepClone, path, value);
      // TODO: dispatch(onUpdateSelectedWidgetAction(newWidget))
    }
  }, [value]);
  return [value, updateValue];
};
