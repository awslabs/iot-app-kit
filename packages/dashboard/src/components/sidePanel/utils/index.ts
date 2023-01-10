import { Dispatch, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { cloneDeep, get, set } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardState } from '../../../store/state';
import { UpdateWidgetsAction } from '../../../store/actions';

export const useInput: <T>(path: string) => [T, Dispatch<T>] = (path) => {
  // TECHDEBT: only support viewing and updating the first selected widget.
  const [selectedWidget] = useSelector((state: DashboardState) => state.selectedWidgets);
  const [inputValue, updateInputValue] = useState(get(selectedWidget, path));
  const dispatch = useDispatch();
  const onSelectedWidgetChange = () => {
    const currentWidgetState = get(selectedWidget, path);
    if (inputValue !== currentWidgetState) {
      updateInputValue(currentWidgetState);
    }
  };
  useEffect(onSelectedWidgetChange, [selectedWidget]);

  const onInputValueChange = () => {
    const currentWidgetState = get(selectedWidget, path);
    if (inputValue !== currentWidgetState) {
      const newWidget = set(cloneDeep(selectedWidget), path, inputValue);
      const updateWidgetAction: UpdateWidgetsAction = {
        type: 'UPDATE_WIDGET',
        payload: {
          widgets: [newWidget],
        },
      };
      dispatch(updateWidgetAction);
    }
  };
  useEffect(onInputValueChange, [inputValue]);

  return [inputValue, updateInputValue];
};

export function capitalizeFirstLetter(string: string) {
  const lowerCase = string.toLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
}
