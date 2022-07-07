/* eslint-disable import/first,import/order */
import React from 'react';
import renderer from 'react-test-renderer';

import { AddObjectMenu } from '../../../../src/components/toolbars/floatingToolbar/items/AddObjectMenu';

import { FloatingToolbar } from '../../../../src/components/toolbars';
import { useStore } from '../../../../src/store';

jest.mock('../../../../src/components/toolbars/floatingToolbar/items', () => ({
  HistoryItemGroup: 'HistoryItemGroup',
  ObjectItemGroup: 'ObjectItemGroup',
  SceneItemGroup: 'SceneItemGroup',
  CancelMenuItem: 'CancelMenuItem',
}));
jest.mock('../../../../src/components/toolbars/floatingToolbar/items/AddObjectMenu', () => ({
  AddObjectMenu: 'AddObjectMenu',
}));

describe('FloatingToolbar', () => {
  beforeEach(() => {
    useStore('default').setState({
      addingWidget: undefined,
    } as any);
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const container = renderer.create(
      <FloatingToolbar enableDefaultItems={true} additionalMenuItems={<AddObjectMenu />} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly in view mode', () => {
    const container = renderer.create(
      <FloatingToolbar isViewing={true} enableDefaultItems={true} additionalMenuItems={<AddObjectMenu />} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly when addingWidget', () => {
    useStore('default').setState({
      addingWidget: {},
    } as any);
    const container = renderer.create(<FloatingToolbar enableDefaultItems={true} />);
    expect(container).toMatchSnapshot();
  });
});
