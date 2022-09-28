import { State, StateCreator } from 'zustand';
import { produce, Draft } from 'immer';
import createVanilla, { GetState, SetState, StoreApi } from 'zustand/vanilla';

import DebugLogger from '../logger/DebugLogger';

import { SceneComposerOperationTypeMap } from './StoreOperations';
import { RootState } from './Store';

const LOG = new DebugLogger('stateStore');

/**
 * Log the update to the state store, the prev state and the updated state.
 */
export const log =
  <T extends State>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    return config(
      (...args) => {
        LOG.verbose('old state', get());
        set(...args);
        LOG.verbose('new state', get());
      },
      get,
      api,
    );
  };

/**
 * Make nested state update simple.
 */
export const immer =
  <T extends State>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState = typeof partial === 'function' ? produce(partial as (state: Draft<T>) => T) : (partial as T);
        set(nextState, replace);
      },
      get,
      api,
    );

/**
 * Undo/Redo, inspired by zundo
 */
export type UndoState = Partial<
  Pick<UndoStoreState, 'undo' | 'redo' | 'clear'> & {
    getUndoState: () => UndoStoreState;
    undoStore: StoreApi<UndoStoreState>;
    // last operation that changed the parent state
    lastOperation?: string;
  }
>;
export interface UndoStoreState {
  prevStates: any[];
  futureStates: any[];
  undo: () => void;
  redo: () => void;
  clear: () => void;
  // handle on the parent store's setter
  setStore: Function;
  // handle on the parent store's getter
  getStore: Function;
}

function filterNoHistoryStates(newState: RootState, currentState: RootState) {
  return {
    ...newState,
    noHistoryStates: currentState.noHistoryStates,
  };
}

// factory to create undoStore. contains memory about past and future states and has methods to traverse states
export const createUndoStore = () => {
  return createVanilla<UndoStoreState>((set, get) => {
    return {
      prevStates: [],
      futureStates: [],
      undo: () => {
        const { prevStates, futureStates, setStore, getStore } = get();
        if (prevStates.length > 0) {
          futureStates.push(getStore());
          const prevState = filterNoHistoryStates(prevStates.pop(), getStore());
          setStore(prevState);
          // force updating the undo store to trigger subscription on the store
          set({ prevStates, futureStates });
        }
      },
      redo: () => {
        const { prevStates, futureStates, setStore, getStore } = get();
        if (futureStates.length > 0) {
          prevStates.push(getStore());
          const futureState = filterNoHistoryStates(futureStates.pop(), getStore());
          setStore(futureState);
          // force updating the undo store to trigger subscription on the store
          set({ prevStates, futureStates });
        }
      },
      clear: () => {
        set({ prevStates: [], futureStates: [] });
      },
      setStore: () => {},
      getStore: () => {},
    };
  });
};

// custom zustand middleware to get previous state
export const undoMiddleware =
  <TState extends UndoState>(config: StateCreator<TState>) =>
  (set: SetState<TState>, get: GetState<TState>, api: StoreApi<TState>) => {
    const undoStore = createUndoStore();
    const { getState, setState } = undoStore;
    const { undo, clear, redo } = getState();
    return config(
      (args) => {
        // Take a snapshot of the current state
        const snapshot = {
          prevStates: [...getState().prevStates, { ...get() }],
          setStore: set,
          futureStates: [],
          getStore: get,
        };

        if (!get().getUndoState) {
          // inject helper functions to user defined store.
          set({
            undo,
            clear,
            redo,
            getUndoState: getState,
            undoStore,
          });
        }

        set(args);

        const lastOperation = get().lastOperation || '';
        const lastOperationType = SceneComposerOperationTypeMap[lastOperation];

        LOG.verbose('lastOperation', lastOperation, 'maps to', lastOperationType);

        if (lastOperationType === 'INITIALIZE') {
          // clear history
          LOG.verbose('clear all history after initialization');
          clear();
        } else if (lastOperationType === 'UPDATE_DOCUMENT') {
          // insert snapshot into the history
          LOG.verbose('insert a new state in undo history', snapshot);
          setState(snapshot);
        } else {
          LOG.verbose("skip the current state as it's not updating the document");
        }
      },
      get,
      api,
    );
  };
