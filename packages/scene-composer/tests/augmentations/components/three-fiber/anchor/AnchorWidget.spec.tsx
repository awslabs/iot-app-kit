import renderer, { act } from 'react-test-renderer';
import React from 'react';
import { useLoader } from '@react-three/fiber';

import { AnchorWidget } from '../../../../../src/augmentations/components/three-fiber/anchor/AnchorWidget';
import { DefaultAnchorStatus, KnownComponentType } from '../../../../../src';
import { useStore } from '../../../../../src/store';

jest.mock('../../../../../src/augmentations/components/three-fiber/common/SvgIconToWidgetSprite', () =>
  jest.fn(((data, name, alwaysVisible, props) => <div data-test-id={name} {...props} />) as any),
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
  const onAnchorClick = jest.fn();
  const setHighlightedSceneNodeRef = jest.fn();
  const setSelectedSceneNodeRef = jest.fn();

  const node = {
    ref: 'test-ref',
    properties: {},
    components: [
      {
        type: 'Tag',
      },
    ],
  };

  const setStore = (selectedSceneNodeRef: string, highlightedSceneNodeRef: string, isViewing = true) => {
    useStore('default').setState({
      selectedSceneNodeRef,
      setSelectedSceneNodeRef,
      highlightedSceneNodeRef,
      setHighlighedSceneNodeRef: setHighlightedSceneNodeRef,
      isViewing: () => isViewing,
      getEditorConfig: () => ({ onWidgetClick, onAnchorClick }),
      dataInput: 'dataInput' as any,
    } as any);
  };

  beforeEach(() => {
    (useLoader as unknown as jest.Mock).mockReturnValue(['TestSvgData']);
    jest.clearAllMocks();
  });

  it('should not call onAnchorClick when switching between anchors', () => {
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
            } as any
          }
          defaultIcon={DefaultAnchorStatus.Info}
        />,
      );
    });
    expect(onWidgetClick).not.toBeCalled();
    expect(onAnchorClick).not.toBeCalled();
  });

  it('should render correctly', () => {
    setStore('test-ref', 'test-ref');
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
    };
    const container = renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should call onAnchorClick with isSelected being true', () => {
    setStore('test-ref', 'test-ref');
    act(() => {
      renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);
    });
    expect(onAnchorClick).toBeCalledWith({
      eventType: 'change',
      anchorNodeRef: 'test-ref',
      isSelected: true,
    });
    expect(setHighlightedSceneNodeRef).toBeCalledWith('test-ref');
  });

  it('should not call onAnchorClick if not viewing', () => {
    setStore('test-ref', 'test-ref', false);
    act(() => {
      renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);
    });
    expect(onWidgetClick).not.toBeCalled();
    expect(onAnchorClick).not.toBeCalled();
  });

  // TODO: Discover a way to test clicking a React Three Fiber object event.
  //  https://sim.amazon.com/issues/IOTROCI-5218
});
