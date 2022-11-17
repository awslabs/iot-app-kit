import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
type Value<T = any> = T;
export const getProperty: <Value>(path: string, object: any) => Value | undefined = (path, object) => {
  return path.split('.').reduce((previousValue: any, currentValue) => {
    if (previousValue !== undefined) {
      if (Object.prototype.hasOwnProperty.call(previousValue, currentValue)) {
        return previousValue[currentValue];
      } else {
        return undefined;
      }
    }
  }, object);
};

export const setProperty: <Value, T>(path: string, value: Value, obj: T) => T = (path: string, value, obj: any) => {
  const [head, ...rest] = path.split('.');

  if (Array.isArray(obj)) {
    const index = Number.parseInt(head);

    return [
      ...obj.slice(0, index),
      rest.length ? setProperty(rest.join('.'), value, obj[index]) : value,
      ...obj.slice(index + 1),
    ];
  }

  return {
    ...obj,
    [head]: rest.length ? setProperty(rest.join('.'), value, obj[head]) : value,
  };
};

export const useInput: <Value>(path: string) => [Value, React.Dispatch<Value>] = (path) => {
  // TODO: get selectedWidget from state
  const selectedWidget = {
    foo: 'foo',
  };
  const [value, updateValue] = useState<Value>(getProperty(path, selectedWidget));
  const dispatch = useDispatch();
  useEffect(() => {
    if (getProperty(path, selectedWidget) !== value) {
      const newWidget = setProperty(path, value, selectedWidget);
      // TODO: dispatch(onUpdateSelectedWidgetAction(newWidget))
    }
  }, [value]);
  return [value, updateValue];
};
