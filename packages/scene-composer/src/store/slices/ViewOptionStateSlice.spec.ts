import { ITagSettings, KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';

import { createViewOptionStateSlice as _createViewOptionStateSlice } from './ViewOptionStateSlice';

const createViewOptionStateSlice = (set) => {
  const { noHistoryStates } = _createViewOptionStateSlice(set);
  return noHistoryStates;
};

describe('createViewOptionStateSlice', () => {
  it('should be able to change motion indicator visibility', () => {
    const draft = {
      lastOperation: undefined,
      noHistoryStates: { componentVisibilities: { [KnownComponentType.MotionIndicator]: false } },
    };

    const set = jest.fn((callback) => callback(draft));

    const { toggleComponentVisibility } = createViewOptionStateSlice(set);
    toggleComponentVisibility(KnownComponentType.MotionIndicator);

    expect(draft.lastOperation!).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[KnownComponentType.MotionIndicator]).toBeTruthy();

    toggleComponentVisibility(KnownComponentType.MotionIndicator);

    expect(draft.lastOperation!).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[KnownComponentType.MotionIndicator]).toBeFalsy();
  });

  it('should be able to change overlay panel visibility', () => {
    const draft = {
      lastOperation: undefined,
      noHistoryStates: { componentVisibilities: { [Component.DataOverlaySubType.OverlayPanel]: false } },
    };

    const set = jest.fn((callback) => callback(draft));

    const { toggleComponentVisibility } = createViewOptionStateSlice(set);
    toggleComponentVisibility(Component.DataOverlaySubType.OverlayPanel);

    expect(draft.lastOperation!).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel]).toBeTruthy();

    toggleComponentVisibility(Component.DataOverlaySubType.OverlayPanel);

    expect(draft.lastOperation!).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel]).toBeFalsy();
  });

  it('should be able to change text annotation visibility', () => {
    const draft = {
      lastOperation: undefined,
      noHistoryStates: { componentVisibilities: { [Component.DataOverlaySubType.TextAnnotation]: false } },
    };

    const set = jest.fn((callback) => callback(draft));

    const { toggleComponentVisibility } = createViewOptionStateSlice(set);
    toggleComponentVisibility(Component.DataOverlaySubType.TextAnnotation);

    expect(draft.lastOperation!).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.TextAnnotation]).toBeTruthy();

    toggleComponentVisibility(Component.DataOverlaySubType.TextAnnotation);

    expect(draft.lastOperation!).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.TextAnnotation]).toBeFalsy();
  });

  it('should be able to change tag visibility', () => {
    const draft = {
      lastOperation: undefined,
      noHistoryStates: { componentVisibilities: { [KnownComponentType.Tag]: false } },
    };

    const set = jest.fn((callback) => callback(draft));

    const { toggleComponentVisibility } = createViewOptionStateSlice(set);
    toggleComponentVisibility(KnownComponentType.Tag);

    expect(draft.lastOperation).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[KnownComponentType.Tag]).toBeTruthy();

    toggleComponentVisibility(KnownComponentType.Tag);

    expect(draft.lastOperation).toEqual('toggleComponentVisibility');
    expect(draft.noHistoryStates.componentVisibilities[KnownComponentType.Tag]).toBeFalsy();
  });

  it('should be able to change tag settings', () => {
    const draft = { lastOperation: undefined, noHistoryStates: { tagSettings: {} } };

    const set = jest.fn((callback) => callback(draft));

    const { setTagSettings } = createViewOptionStateSlice(set);
    setTagSettings({
      scale: 3.3,
      autoRescale: true,
      enableOcclusion: false,
    });

    expect(draft.lastOperation!).toEqual('setTagSettings');
    expect((draft.noHistoryStates.tagSettings as ITagSettings).scale).toEqual(3.3);
    expect((draft.noHistoryStates.tagSettings as ITagSettings).autoRescale).toBeTruthy();
    expect((draft.noHistoryStates.tagSettings as ITagSettings).enableOcclusion).toBeFalsy();
  });

  it('should be able to set viewport', () => {
    const draft = {
      lastOperation: undefined,
      noHistoryStates: { viewport: undefined },
    };

    const set = jest.fn((callback) => callback(draft));

    const { setViewport } = createViewOptionStateSlice(set);
    setViewport({ duration: '5m' });

    expect(draft.lastOperation!).toEqual('setViewport');
    expect(draft.noHistoryStates.viewport).toEqual({ duration: '5m' });

    setViewport(undefined);

    expect(draft.lastOperation!).toEqual('setViewport');
    expect(draft.noHistoryStates.viewport).toBeUndefined();
  });

  it('should be able to set data binding refresh rate', () => {
    const draft = {
      lastOperation: undefined,
      noHistoryStates: { dataBindingQueryRefreshRate: undefined },
    };

    const set = jest.fn((callback) => callback(draft));

    const { setDataBindingQueryRefreshRate } = createViewOptionStateSlice(set);
    setDataBindingQueryRefreshRate(6666);

    expect(draft.lastOperation!).toEqual('setDataBindingQueryRefreshRate');
    expect(draft.noHistoryStates.dataBindingQueryRefreshRate).toEqual(6666);

    setDataBindingQueryRefreshRate(undefined);

    expect(draft.lastOperation!).toEqual('setDataBindingQueryRefreshRate');
    expect(draft.noHistoryStates.dataBindingQueryRefreshRate).toBeUndefined();
  });

  it('should be able to enable auto query', () => {
    const draft = {
      lastOperation: undefined,
      noHistoryStates: { autoQueryEnabled: false },
    };

    const set = jest.fn((callback) => callback(draft));

    const { setAutoQueryEnabled } = createViewOptionStateSlice(set);
    setAutoQueryEnabled(true);

    expect(draft.lastOperation!).toEqual('setAutoQueryEnabled');
    expect(draft.noHistoryStates.autoQueryEnabled).toBeTruthy();

    setAutoQueryEnabled(false);

    expect(draft.lastOperation!).toEqual('setAutoQueryEnabled');
    expect(draft.noHistoryStates.autoQueryEnabled).toBeFalsy();
  });
});
