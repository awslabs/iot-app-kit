import { useLoader } from '@react-three/fiber';
import React from 'react';
import { act, create } from 'react-test-renderer';
import * as THREE from 'three';

import {
  Anchor,
  DEFAULT_TAG_GLOBAL_SETTINGS,
  DefaultAnchorStatus,
  IValueDataBinding,
  KnownComponentType,
} from '../../../../..';
import useTagSettings from '../../../../../hooks/useTagSettings';
import { ISceneNodeInternal, useStore } from '../../../../../store/Store';
import { AnchorWidget, AsyncLoadedAnchorWidget } from '../AnchorWidget';

jest.mock('../../common/SvgIconToWidgetSprite', () =>
  jest.fn((_, __, key, ___, props) => <div data-test-id={key} {...props} />),
);

jest.mock('../../../../../hooks/useTagSettings', () => jest.fn());
jest.mock('../../../../../hooks/useBindingData', () =>
  jest.fn().mockReturnValue({ data: [{ alarm_status: 'ACTIVE' }] }),
);

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

  const getSceneRuleMapByIdMock = jest.fn();
  const setStore = (
    selectedSceneNodeRef: string,
    highlightedSceneNodeRef: string,
    isViewing = true,
    tagVisible = true,
  ) => {
    useStore('default').setState({
      getSceneRuleMapById: getSceneRuleMapByIdMock,
      selectedSceneNodeRef,
      setSelectedSceneNodeRef,
      highlightedSceneNodeRef,
      setHighlightedSceneNodeRef: setHighlightedSceneNodeRef,
      isViewing: () => isViewing,
      getEditorConfig: () => ({ onWidgetClick }),
      dataInput: { dataFrames: [], timeRange: { from: 0, to: 1 } },
      getObject3DBySceneNodeRef,
      noHistoryStates: {
        ...useStore('default').getState().noHistoryStates,
        componentVisibilities: { [KnownComponentType.Tag]: tagVisible },
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
      create(
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
    const container = create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with data binding rule', () => {
    setStore('test-ref', 'test-ref');
    getSceneRuleMapByIdMock.mockImplementation((id) =>
      id == 'rule-id'
        ? {
            statements: [
              {
                expression: "alarm_status == 'ACTIVE'",
                target: 'iottwinmaker.common.icon:Error',
              },
            ],
          }
        : undefined,
    );
    const container = create(
      <AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} ruleBasedMapId='rule-id' />,
    );

    expect(container.root.findByType('anchor').props.visualState).toEqual('Error');
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with data binding custom rule', () => {
    setStore('test-ref', 'test-ref');
    getSceneRuleMapByIdMock.mockImplementation((id) =>
      id == 'rule-id'
        ? {
            statements: [
              {
                expression: "alarm_status == 'ACTIVE'",
                target: 'iottwinmaker.common.icon:Custom',
                targetMetadata: {
                  color: '#ffffff',
                },
              },
            ],
          }
        : undefined,
    );
    const container = create(
      <AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} ruleBasedMapId='rule-id' />,
    );

    expect(container.root.findByType('anchor').props.visualState).toEqual('Custom');
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with non default tag settings', () => {
    setStore('test-ref', 'test-ref');
    (useTagSettings as jest.Mock).mockReturnValue({ scale: 3, autoRescale: true });
    const container = create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when not visible', () => {
    setStore('test-ref', 'test-ref', true, false);
    const container = create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);

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
    const container = create(<AnchorWidget node={offsetNode} defaultIcon={DefaultAnchorStatus.Info} />);

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
      container = create(<AnchorWidget node={nodeWithParent} defaultIcon={DefaultAnchorStatus.Info} />, options);
    });

    expect(container).toMatchSnapshot();
  });

  it('should not call onWidgetClick if not viewing', () => {
    setStore('test-ref', 'test-ref', false);
    act(() => {
      create(<AnchorWidget node={node} defaultIcon={DefaultAnchorStatus.Info} />);
    });
    expect(onWidgetClick).not.toBeCalled();
  });
});

/**
 * Fix for TODO: Discover a way to test clicking a React Three Fiber object event.
 * https://sim.amazon.com/issues/IOTROCI-5218
 * There is no direct real click support with react-test-renderer. So here
 * mock the onWidgetClick event and validate details after eventClick.
 * This test also help us to validate the tag details on event click.
 */
describe('AnchorWidget onWidgetClick', () => {
  const onWidgetClickMock = jest.fn();
  const setHighlightedSceneNodeRef = jest.fn();
  const setSelectedSceneNodeRef = jest.fn();
  const getObject3DBySceneNodeRef = jest.fn();
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
      getEditorConfig: () => ({ onWidgetClick: onWidgetClickMock }),
      dataInput: { dataFrames: [], timeRange: { from: 0, to: 1 } },
      getObject3DBySceneNodeRef,
      noHistoryStates: {
        ...useStore('default').getState().noHistoryStates,
        componentVisibilities: { [KnownComponentType.Tag]: tagVisible },
      },
    });
  };
  (useTagSettings as jest.Mock).mockReturnValue({
    autoRescale: true,
  });

  it('should trigger onWidgetClick action when clicked', () => {
    setStore('test-ref', 'other-ref', true, true);
    const event = {
      eventObject: new Anchor(),
    };
    const mockSceneNode: ISceneNodeInternal = {
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

    const defaultIcon = 'info';
    const chosenColor = '#ffffff';
    const mockValueDataBinding: IValueDataBinding = {
      dataBindingContext: {
        entityId: 'ent',
        componentName: 'comp',
        propertyName: 'prop',
      },
    };

    const component = create(
      <AnchorWidget
        node={mockSceneNode}
        defaultIcon={defaultIcon}
        chosenColor={chosenColor}
        valueDataBinding={mockValueDataBinding}
      />,
    );

    const anchorWidget = component.root.findByType(AnchorWidget);
    const asyncLoadedAnchorWidget = anchorWidget.findByType(AsyncLoadedAnchorWidget);
    const anchorElement = asyncLoadedAnchorWidget.findByType('anchor'); // Assuming the Anchor component is imported from 'three-js'
    anchorElement.props.onClick(event);

    expect(onWidgetClickMock).toHaveBeenCalledTimes(1);
    expect(onWidgetClickMock).toHaveBeenCalledWith({
      componentTypes: ['Tag'],
      nodeRef: 'test-ref',
      additionalComponentData: [
        {
          chosenColor: '#ffffff',
          navLink: undefined,
          dataBindingContext: {
            componentName: 'comp',
            entityId: 'ent',
            propertyName: 'prop',
          },
        },
      ],
    });

    const lineSegmentElement = asyncLoadedAnchorWidget.findByType('lineSegments');
    lineSegmentElement.props.onClick(event);
    expect(onWidgetClickMock).toHaveBeenCalledTimes(2);
    expect(onWidgetClickMock).toHaveBeenCalledWith({
      componentTypes: ['Tag'],
      nodeRef: 'test-ref',
      additionalComponentData: [
        {
          chosenColor: '#ffffff',
          navLink: undefined,
          dataBindingContext: {
            componentName: 'comp',
            entityId: 'ent',
            propertyName: 'prop',
          },
        },
      ],
    });
  });
});
