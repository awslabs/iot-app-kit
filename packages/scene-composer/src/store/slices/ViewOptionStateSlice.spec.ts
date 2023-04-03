import { ITagSettings, KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';

import { createViewOptionStateSlice } from './ViewOptionStateSlice';

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
    setTagSettings({ scale: 3.3, autoRescale: true });

    expect(draft.lastOperation!).toEqual('setTagSettings');
    expect((draft.noHistoryStates.tagSettings as ITagSettings).scale).toEqual(3.3);
    expect((draft.noHistoryStates.tagSettings as ITagSettings).autoRescale).toBeTruthy();
  });
});
