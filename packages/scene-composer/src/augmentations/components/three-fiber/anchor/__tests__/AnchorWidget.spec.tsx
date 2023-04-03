import renderer, { act } from 'react-test-renderer';
import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

import { AnchorWidget } from '../AnchorWidget';
import { DefaultAnchorStatus, DEFAULT_TAG_GLOBAL_SETTINGS, KnownComponentType } from '../../../../..';
import { ISceneNodeInternal, useStore } from '../../../../../store';
import useTagSettings from '../../../../../hooks/useTagSettings';

jest.mock('../../common/SvgIconToWidgetSprite', () =>
  jest.fn((_, name, __, props) => <div data-test-id={name} {...props} />),
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

  const node: ISceneNodeInternal = {
    ref: 'test-ref',
    name: 'node',
    childRefs: [],
    transformConstraint: {},
    properties: {},
    components: [
      {
        ref: 'ref',
        type: 'Tag',
      },
    ],
    transform: {
      position: [1, 1, 1],
      rotation: [1, 1, 1],
      scale: [1, 1, 1],
    },
  };

  const setStore = (
    selectedSceneNodeRef: string,
    highlightedSceneNodeRef: string,
    isViewing = true,
    tagVisible = true,
  ) => {
    useStore('default').setState({
      selectedSceneNodeRef,
      setSelectedSceneNodeRef,
      highlightedSceneNodeRef,
      setHighlightedSceneNodeRef: setHighlightedSceneNodeRef,
      isViewing: () => isViewing,
      getEditorConfig: () => ({ onWidgetClick }),
      dataInput: { dataFrames: [], timeRange: { from: 0, to: 1 } },
      getObject3DBySceneNodeRef,
      noHistoryStates: {
        componentVisibilities: { [KnownComponentType.Tag]: tagVisible },
        toggleComponentVisibility: jest.fn(),
        setTagSettings: jest.fn(),
        setMatterportViewerEnabled: jest.fn(),
      },
    });
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
          node={{
            ...node,
            ref: 'other-ref',
          }}
          defaultIcon={DefaultAnchorStatus.Info}
        />,
      );
    });
    expect(onWidgetClick).not.toBeCalled();
  });

  it('should render correctly', () => {
    setStore('test-ref', 'test-ref');
    const container = renderer.create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with non default tag settings', () => {
    setStore('test-ref', 'test-ref');
    (useTagSettings as jest.Mock).mockReturnValue({ scale: 3, autoRescale: true });
    const container = renderer.create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when not visible', () => {
    setStore('test-ref', 'test-ref', true, false);
    const container = renderer.create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with an offset', () => {
    setStore('test-ref', 'test-ref');
    const offsetNode = {
      ...node,
      components: [
        {
          ref: 'ref',
          type: 'Tag',
          offset: [1, 0, 1],
        },
      ],
    };
    const container = renderer.create(<AnchorWidget node={offsetNode} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render with a countered size when parent is scaled', () => {
    setStore('test-ref', 'test-ref');
    const nodeWithParent = {
      ...node,
      parentRef: 'parent-ref',
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
      container = renderer.create(
        <AnchorWidget node={nodeWithParent} defaultIcon={DefaultAnchorStatus.Info} />,
        options,
      );
    });

    expect(container).toMatchSnapshot();
  });

  it('should not call onWidgetClick if not viewing', () => {
    setStore('test-ref', 'test-ref', false);
    act(() => {
      renderer.create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);
    });
    expect(onWidgetClick).not.toBeCalled();
  });

  // TODO: Discover a way to test clicking a React Three Fiber object event.
  //  https://sim.amazon.com/issues/IOTROCI-5218
});
