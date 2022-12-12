import { Dispatch, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../../store/state';

export const useInput: <T>(path: string) => [T, Dispatch<T>] = (path) => {
  // TECHDEBT: only support viewing and updating the first selected widget.
  const [selectedWidget] = useSelector((state: DashboardState) => state.dashboardConfiguration.widgets);
  const [inputValue, updateInputValue] = useState(get(selectedWidget, path));

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
      // TODO: dispatch an action to update widget
    }
  };
  useEffect(onInputValueChange, [inputValue]);

  return [inputValue, updateInputValue];
};

export function capitalizeFirstLetter(string: string) {
  const lowerCase = string.toLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
}
