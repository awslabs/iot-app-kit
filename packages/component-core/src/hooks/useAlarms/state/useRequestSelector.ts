import isEqual from 'lodash-es/isEqual';
import { useState } from 'react';
import { useCustomCompareEffect } from 'react-use';

/**
 * Helper hook for memoizing selected request objects
 * off a piece of state. This will be used in each
 * helper hook that wants to use the alarms state
 * object to map the its corresponding requets.
 *
 * e.g., mapping alarmModel names off the state.
 * OR mapping asset property queries off the state
 */
export const useRequestSelector = <State, SelectedState>(
  state: State,
  selector: (state: State) => SelectedState,
  equalityFn: (a: SelectedState, b: SelectedState) => boolean = isEqual
) => {
  const [internalState, setInternalState] = useState(selector(state));

  useCustomCompareEffect(
    () => {
      setInternalState(selector(state));
    },
    [internalState, state] as const,
    (
      [previousInternalState, previousState],
      [nextInternalState, nextState]
    ) => {
      return (
        equalityFn(previousInternalState, nextInternalState) &&
        equalityFn(selector(previousState), selector(nextState))
      );
    }
  );

  return internalState;
};
