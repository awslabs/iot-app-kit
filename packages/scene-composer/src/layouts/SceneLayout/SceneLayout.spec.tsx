/* eslint-disable import/first */
/* eslint-disable import/order */
import * as React from 'react';
import { create } from 'react-test-renderer';

import { SceneLayout } from '.';
import { accessStore } from '../../store';
import { KnownComponentType } from '../../interfaces';
import useSelectedNode from '../../hooks/useSelectedNode';

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

jest.mock('../../hooks/useSelectedNode', () => jest.fn());

jest.mock('../../hooks/useSceneModal', () => jest.fn());

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
    accessStore('default').setState({
      getComponentRefByType: getComponentRefByTypeMock,
      document: { componentNodeMap: {} } as any,
    });
    getComponentRefByTypeMock.mockReturnValue({});
    (useSelectedNode as jest.Mock).mockReturnValue({
      selectedSceneNode: {
        ref: 'test-ref',
        name: 'Test Node',
        components: [
          {
            type: KnownComponentType.ModelRef,
          },
        ],
      },
    });
  });

  [
    ['Edit mode', { isViewing: false }],
    ['Viewing mode', { isViewing: true }],
  ].forEach((value) => {
    it(`should render correctly in ${value[0]}`, () => {
      const container = create(
        <SceneLayout
          onPointerMissed={() => {}}
          LoadingView={<div data-test-id='Loading view' />}
          {...(value[1] as { isViewing: boolean })}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  it('should render camera preview if editing and camera component is on selectedNode', () => {
    (useSelectedNode as jest.Mock).mockReturnValueOnce({
      selectedSceneNode: {
        ref: 'test-ref',
        name: 'Test Camera',
        components: [
          {
            type: KnownComponentType.Camera,
          },
        ],
      },
    });

    const container = create(
      <SceneLayout onPointerMissed={() => {}} LoadingView={<div data-test-id='Loading view' />} isViewing={false} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should not render camera preview if editing and non-camera component is on selectedNode', () => {
    const container = create(
      <SceneLayout onPointerMissed={() => {}} LoadingView={<div data-test-id='Loading view' />} isViewing={false} />,
    );

    expect(container).toMatchSnapshot();
  });
});
