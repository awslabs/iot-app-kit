import renderer, { act } from 'react-test-renderer';
import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

import { AnchorWidget } from '../AnchorWidget';
import { DefaultAnchorStatus, DEFAULT_TAG_GLOBAL_SETTINGS } from '../../../../..';
import { useStore } from '../../../../../store';
import useTagSettings from '../../../../../hooks/useTagSettings';

jest.mock('../../common/SvgIconToWidgetSprite', () =>
  jest.fn(((data, name, alwaysVisible, props) => <div data-test-id={name} {...props} />) as any),
);

jest.mock('../../../../../hooks/useTagSettings', () => jest.fn());

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useLoader: jest.fn(),
    useFrame: jest.fn().mockImplementation((func) => {
      func();
    }),
  };
});

describe('AnchorWidget', () => {
  const onWidgetClick = jest.fn();
  const setHighlightedSceneNodeRef = jest.fn();
  const setSelectedSceneNodeRef = jest.fn();
  const getObject3DBySceneNodeRef = jest.fn();

  const node = {
    ref: 'test-ref',
    properties: {},
    components: [
      {
        type: 'Tag',
      },
    ],
    transform: {
      scale: [1, 1, 1],
    },
  };

  const setStore = (selectedSceneNodeRef: string, highlightedSceneNodeRef: string, isViewing = true) => {
    useStore('default').setState({
      selectedSceneNodeRef,
      setSelectedSceneNodeRef,
      highlightedSceneNodeRef,
      setHighlightedSceneNodeRef: setHighlightedSceneNodeRef,
      isViewing: () => isViewing,
      getEditorConfig: () => ({ onWidgetClick }),
      dataInput: 'dataInput' as any,
      getObject3DBySceneNodeRef,
    } as any);
  };

  beforeEach(() => {
    (useLoader as unknown as jest.Mock).mockReturnValue(['TestSvgData']);
    (useTagSettings as jest.Mock).mockReturnValue(DEFAULT_TAG_GLOBAL_SETTINGS);
    jest.clearAllMocks();
  });

  it('should not call onWidgetClick when switching between anchors', () => {
    setStore('test-ref', 'other-ref');

    act(() => {
      renderer.create(
        <AnchorWidget
          node={
            {
              ref: 'other-ref',
              properties: {},
              components: [
                {
                  type: 'Tag',
                },
              ],
              transform: {
                scale: [1, 1, 1],
              },
            } as any
          }
          defaultIcon={DefaultAnchorStatus.Info}
        />,
      );
    });
    expect(onWidgetClick).not.toBeCalled();
  });

  it('should render correctly', () => {
    setStore('test-ref', 'test-ref');
    const container = renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with non default tag settings', () => {
    setStore('test-ref', 'test-ref');
    (useTagSettings as jest.Mock).mockReturnValue({ scale: 3, autoRescale: true });
    const container = renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with an offset', () => {
    setStore('test-ref', 'test-ref');
    const node = {
      ref: 'test-ref',
      properties: {},
      components: [
        {
          type: 'Tag',
          offset: [1, 0, 1],
        },
      ],
      transform: {
        scale: [1, 1, 1],
      },
    };
    const container = renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render with a countered size when parent is scaled', () => {
    setStore('test-ref', 'test-ref');
    const node = {
      ref: 'test-ref',
      properties: {},
      parentRef: 'parent-ref',
      components: [
        {
          type: 'Tag',
        },
      ],
      transform: {
        scale: [1, 1, 1],
      },
    };

    const parent = new THREE.Group();
    parent.scale.set(2, 2, 2);
    getObject3DBySceneNodeRef.mockReturnValueOnce(parent);

    const options = {
      createNodeMock: (element) => {
        if (element.type === 'group') {
          const group = new THREE.Group();
          group.scale.set(2, 2, 2);
          return group;
        }
        return null;
      },
    };

    let container;
    act(() => {
      container = renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />, options);
    });

    expect(container).toMatchSnapshot();
  });

  it('should not call onWidgetClick if not viewing', () => {
    setStore('test-ref', 'test-ref', false);
    act(() => {
      renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);
    });
    expect(onWidgetClick).not.toBeCalled();
  });

  // TODO: Discover a way to test clicking a React Three Fiber object event.
  //  https://sim.amazon.com/issues/IOTROCI-5218
});
