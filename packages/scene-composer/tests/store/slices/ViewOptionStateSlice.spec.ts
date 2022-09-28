import { createViewOptionStateSlice } from '../../../src/store/slices/ViewOptionStateSlice';

describe('createViewOptionStateSlice', () => {
  it('should be able to change motioon indicator visibility', () => {
    const draft = { lastOperation: undefined, noHistoryStates: { motionIndicatorVisible: false } };

    const get = jest.fn();
    const set = jest.fn(((callback) => callback(draft)) as any);

    const { toggleMotionIndicatorVisibility } = createViewOptionStateSlice(set, get, undefined as any);
    toggleMotionIndicatorVisibility();

    expect(draft.lastOperation!).toEqual('toggleMotionIndicatorVisibility');
    expect(draft.noHistoryStates.motionIndicatorVisible).toBeTruthy();

    toggleMotionIndicatorVisibility();

    expect(draft.lastOperation!).toEqual('toggleMotionIndicatorVisibility');
    expect(draft.noHistoryStates.motionIndicatorVisible).toBeFalsy();
  });
});
