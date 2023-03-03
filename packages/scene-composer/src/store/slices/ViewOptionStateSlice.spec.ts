import { ITagSettings } from '../../interfaces';

import { createViewOptionStateSlice } from './ViewOptionStateSlice';

describe('createViewOptionStateSlice', () => {
  it('should be able to change motioon indicator visibility', () => {
    const draft = { lastOperation: undefined, noHistoryStates: { motionIndicatorVisible: false } };

    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    const { toggleMotionIndicatorVisibility } = createViewOptionStateSlice(set, get);
    toggleMotionIndicatorVisibility();

    expect(draft.lastOperation!).toEqual('toggleMotionIndicatorVisibility');
    expect(draft.noHistoryStates.motionIndicatorVisible).toBeTruthy();

    toggleMotionIndicatorVisibility();

    expect(draft.lastOperation!).toEqual('toggleMotionIndicatorVisibility');
    expect(draft.noHistoryStates.motionIndicatorVisible).toBeFalsy();
  });

  it('should be able to change tag settings', () => {
    const draft = { lastOperation: undefined, noHistoryStates: { tagSettings: {} } };

    const get = jest.fn();
    const set = jest.fn((callback) => callback(draft));

    const { setTagSettings } = createViewOptionStateSlice(set, get);
    setTagSettings({ scale: 3.3, autoRescale: true });

    expect(draft.lastOperation!).toEqual('setTagSettings');
    expect((draft.noHistoryStates.tagSettings as ITagSettings).scale).toEqual(3.3);
    expect((draft.noHistoryStates.tagSettings as ITagSettings).autoRescale).toBeTruthy();
  });
});
