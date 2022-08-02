/* eslint-disable import/first */
/* eslint-disable import/order */
import * as React from 'react';
import renderer from 'react-test-renderer';

import { SceneLayout } from '.';
import { useStore } from '../../store';

jest.mock('.', () => {
  const originalModule = jest.requireActual('.');
  return {
    ...originalModule,
    LeftPanel: 'LeftPanel',
    RightPanel: 'RightPanel',
  };
});

jest.mock('../../components/panels/TopBar', () => {
  const originalModule = jest.requireActual('../../components/panels/TopBar');
  return {
    ...originalModule,
    TopBar: 'TopBar',
  };
});

class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

describe('SceneLayout', () => {
  window.ResizeObserver = ResizeObserver;
  const getComponentRefByTypeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useStore('default').setState({
      getComponentRefByType: getComponentRefByTypeMock,
      document: { componentNodeMap: {} } as any,
    });
    getComponentRefByTypeMock.mockReturnValue({});
  });

  [
    ['Edit mode', { isViewing: false, showMessageModal: false }],
    ['Viewing mode', { isViewing: true, showMessageModal: false }],
    ['Edit mode with Modal', { isViewing: false, showMessageModal: true }],
    ['Viewing mode with modal', { isViewing: true, showMessageModal: true }],
  ].forEach((value) => {
    it(`should render correctly in ${value[0]}`, () => {
      const container = renderer.create(
        <SceneLayout
          onPointerMissed={() => {}}
          LoadingView={<div data-test-id={'Loading view'} />}
          {...(value[1] as any)}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
