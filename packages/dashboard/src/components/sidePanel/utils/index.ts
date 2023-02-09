import { Dispatch, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { cloneDeep, get, set } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardState } from '../../../store/state';
import { onUpdateWidgetsAction } from '../../../store/actions';
import { AppKitWidget, TextWidget, Widget } from '../../../types';

export type typedInputHook<T extends Widget = Widget> = <K extends keyof T>(key: K) => [T[K], Dispatch<T[K]>];

export const useInput: <T>(path: string, validator?: (newValue: T) => boolean) => [T, Dispatch<T>] = (
  path,
  validator
) => {
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
      const validation = validator ? validator(inputValue) : true;
      if (!validation) {
        return;
      }
      const newWidget = set(cloneDeep(selectedWidget), path, inputValue);
      dispatch(
        onUpdateWidgetsAction({
          widgets: [newWidget],
        })
      );
    }
  };
  useEffect(onInputValueChange, [inputValue]);

  return [inputValue, updateInputValue];
};

// this helps Typescript finding correct types given attribute names
export const useTextWidgetInput: typedInputHook<TextWidget> = useInput;
export const useAppKitWidgetInput: typedInputHook<AppKitWidget> = useInput;
