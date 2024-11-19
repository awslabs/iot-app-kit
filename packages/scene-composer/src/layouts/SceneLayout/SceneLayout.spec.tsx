/* eslint-disable import/first */
/* eslint-disable import/order */
import { render } from '@/tests/testing-library';
import { SceneLayout } from '.';
import useSelectedNode from '../../hooks/useSelectedNode';
import { KnownComponentType } from '../../interfaces';
import { accessStore } from '../../store';

vi.mock('.', async () => {
  const originalModule = await vi.importActual('.');
  return {
    ...originalModule,
    LeftPanel: 'LeftPanel',
    RightPanel: 'RightPanel',
  };
});

vi.mock('../../components/panels/TopBar', async () => {
  const originalModule = await vi.importActual('../../components/panels/TopBar');
  return {
    ...originalModule,
    TopBar: 'TopBar',
  };
});

vi.mock('../../hooks/useSelectedNode', () => ({ default: vi.fn() }));

vi.mock('../../hooks/useSceneModal', () => ({ default: vi.fn() }));

class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('SceneLayout', () => {
  window.ResizeObserver = ResizeObserver;
  const getComponentRefByTypeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    accessStore('default').setState({
      getComponentRefByType: getComponentRefByTypeMock,
      document: { componentNodeMap: {} } as any,
    });
    getComponentRefByTypeMock.mockReturnValue({});
    (useSelectedNode as vi.Mock).mockReturnValue({
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
      const { container } = render(
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
    (useSelectedNode as vi.Mock).mockReturnValueOnce({
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

    const { container } = render(
      <SceneLayout onPointerMissed={() => {}} LoadingView={<div data-test-id='Loading view' />} isViewing={false} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should not render camera preview if editing and non-camera component is on selectedNode', () => {
    const { container } = render(
      <SceneLayout onPointerMissed={() => {}} LoadingView={<div data-test-id='Loading view' />} isViewing={false} />,
    );

    expect(container).toMatchSnapshot();
  });
});
