import renderer, { act } from 'react-test-renderer';
import React from 'react';
import { useLoader } from '@react-three/fiber';

import { AnchorWidget } from '../../../../../src/augmentations/components/three-fiber/anchor/AnchorWidget';
import { DefaultAnchorStatus } from '../../../../../src';
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

  beforeEach(() => {
    (useLoader as unknown as jest.Mock).mockReturnValue(['TestSvgData']);

    useStore('default').setState({
      selectedSceneNodeRef: 'test-ref',
      setSelectedSceneNodeRef,
      highlightedSceneNodeRef: 'test-ref',
      setHighlighedSceneNodeRef: setHighlightedSceneNodeRef,
      isViewing: () => true,
      getEditorConfig: () => ({ onAnchorClick }),
      dataInput: 'sataInput' as any,
    } as any);

    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const container = renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with an offset', () => {
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

  it('should not call onAnchorClick and de-highlight the node', () => {
    useStore('default').setState({
      selectedSceneNodeRef: 'test-ref',
      setSelectedSceneNodeRef,
      highlightedSceneNodeRef: 'other-ref',
      setHighlighedSceneNodeRef: setHighlightedSceneNodeRef,
      isViewing: () => true,
      getEditorConfig: () => ({ onAnchorClick }),
      dataInput: 'dataInput' as any,
    } as any);

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
    expect(onAnchorClick).not.toBeCalled();
    expect(setHighlightedSceneNodeRef).toBeCalledWith(undefined);
  });

  it('should not call onAnchorClick if not viewing', () => {
    useStore('default').setState({
      selectedSceneNodeRef: 'test-ref',
      setSelectedSceneNodeRef,
      highlightedSceneNodeRef: 'test-ref',
      setHighlighedSceneNodeRef: setHighlightedSceneNodeRef,
      isViewing: () => false,
      getEditorConfig: () => ({ onAnchorClick }),
      dataInput: 'sataInput' as any,
    } as any);

    act(() => {
      renderer.create(<AnchorWidget node={node as any} defaultIcon={DefaultAnchorStatus.Info} />);
    });
    expect(onAnchorClick).not.toBeCalled();
  });

  // TODO: Discover a way to test clicking a React Three Fiber object event.
  //  https://sim.amazon.com/issues/IOTROCI-5218
});
